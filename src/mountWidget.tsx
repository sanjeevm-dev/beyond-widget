import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import App from "./App";

export interface MountWidgetConfig {
  clientKey: string;
  container?: HTMLElement;
  containerId?: string;
  targetSelector?: string;
  customUserId?: string;
  apiUrl?: string;
  removeContainerOnDestroy?: boolean;
}

export interface MountResult {
  container: HTMLElement;
  destroy: () => void;
}

interface MountedRecord {
  root: Root;
  container: HTMLElement;
  removeOnDestroy: boolean;
  autoCreated: boolean;
}

const mountedInstances = new Map<HTMLElement, MountedRecord>();
const DEFAULT_CONTAINER_ID = "exthalpy-assistant";
const AUTO_CREATED_ATTR = "data-exthalpy-auto-created";
const GLOBAL_NAMESPACE = "ExthalpyAssistant";

function assertBrowserEnvironment() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("[ExthalpyAssistant] mountCustomerSupportChatbot can only run in a browser environment.");
  }
}

function ensureConfig(config: MountWidgetConfig): MountWidgetConfig {
  if (!config || typeof config !== "object") {
    throw new Error("[ExthalpyAssistant] A configuration object is required to mount the widget.");
  }
  if (!config.clientKey) {
    throw new Error("[ExthalpyAssistant] clientKey is required to mount the widget.");
  }
  return config;
}

function resolveContainer(config: MountWidgetConfig) {
  if (config.container) {
    return {
      container: config.container,
      removeOnDestroy: Boolean(config.removeContainerOnDestroy),
      autoCreated: false,
    };
  }

  if (config.targetSelector) {
    const target = document.querySelector<HTMLElement>(config.targetSelector);
    if (!target) {
      throw new Error(
        `[ExthalpyAssistant] Element not found for selector "${config.targetSelector}".`
      );
    }
    return {
      container: target,
      removeOnDestroy: Boolean(config.removeContainerOnDestroy),
      autoCreated: false,
    };
  }

  const containerId = config.containerId || DEFAULT_CONTAINER_ID;
  let container = document.getElementById(containerId);

  if (container) {
    const removeOnDestroy = config.removeContainerOnDestroy ?? false;
    return { container, removeOnDestroy, autoCreated: false };
  }

  container = document.createElement("div");
  container.id = containerId;
  container.setAttribute(AUTO_CREATED_ATTR, "true");
  document.body.appendChild(container);

  return {
    container,
    removeOnDestroy: config.removeContainerOnDestroy ?? true,
    autoCreated: true,
  };
}

function cleanupInstance(record: MountedRecord) {
  record.root.unmount();

  if (
    record.removeOnDestroy &&
    record.autoCreated &&
    record.container.parentNode
  ) {
    record.container.parentNode.removeChild(record.container);
  }
}

export function destroyCustomerSupportChatbot(container?: HTMLElement) {
  if (container) {
    const record = mountedInstances.get(container);
    if (!record) {
      return;
    }
    cleanupInstance(record);
    mountedInstances.delete(container);
    return;
  }

  mountedInstances.forEach((record) => {
    cleanupInstance(record);
  });
  mountedInstances.clear();
}

export function mountCustomerSupportChatbot(config: MountWidgetConfig): MountResult {
  assertBrowserEnvironment();

  const ensuredConfig = ensureConfig(config);
  const { container, removeOnDestroy, autoCreated } = resolveContainer(ensuredConfig);

  const existingRecord = mountedInstances.get(container);
  if (existingRecord) {
    cleanupInstance(existingRecord);
    mountedInstances.delete(container);
  }

  const root = createRoot(container);

  root.render(
    <App
      clientKey={ensuredConfig.clientKey}
      customUserId={ensuredConfig.customUserId}
      apiUrl={ensuredConfig.apiUrl}
    />
  );

  const record: MountedRecord = {
    root,
    container,
    removeOnDestroy,
    autoCreated,
  };

  mountedInstances.set(container, record);

  const destroy = () => {
    const storedRecord = mountedInstances.get(container);
    if (!storedRecord) {
      return;
    }
    cleanupInstance(storedRecord);
    mountedInstances.delete(container);
  };

  return { container, destroy };
}

interface ExthalpyAssistantGlobal {
  mount: (config: MountWidgetConfig) => MountResult;
  destroy: (container?: HTMLElement) => void;
}

declare global {
  interface Window {
    ExthalpyAssistant?: ExthalpyAssistantGlobal;
    mountCustomerSupportChatbot?: (container: HTMLElement, clientKey: string) => MountResult;
  }
}

const globalScope = globalThis as unknown as Window;
const existingGlobal = globalScope?.[GLOBAL_NAMESPACE] ?? {};

const assistantApi: ExthalpyAssistantGlobal = {
  ...existingGlobal,
  mount: mountCustomerSupportChatbot,
  destroy: destroyCustomerSupportChatbot,
};

if (typeof window !== "undefined") {
  window[GLOBAL_NAMESPACE] = assistantApi;
  window.mountCustomerSupportChatbot = (container: HTMLElement, clientKey: string) =>
    assistantApi.mount({ container, clientKey });
}

export default assistantApi;
