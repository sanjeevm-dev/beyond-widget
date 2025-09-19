import { createRoot } from "react-dom/client";
import App from "./App";

interface WidgetConfig {
  clientKey: string;
  customUserId?: string;
  apiUrl?: string;
  removeContainerOnDestroy?: boolean;
}

interface WidgetInstance {
  destroy: () => void;
}

type AutoMountedRecord = {
  instance: WidgetInstance;
  container: HTMLElement;
  removeContainerOnDestroy: boolean;
};

function mount(container: HTMLElement, config: WidgetConfig): WidgetInstance {
  const { clientKey, customUserId, apiUrl, removeContainerOnDestroy } = config;
  const root = createRoot(container);

  root.render(
    <App clientKey={clientKey} customUserId={customUserId} apiUrl={apiUrl} />
  );

  return {
    destroy: () => {
      root.unmount();
      if (removeContainerOnDestroy !== false && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
  };
}

const autoMountedInstances = new Map<HTMLScriptElement, AutoMountedRecord>();

function resolveExecutingScript(): HTMLScriptElement | null {
  const current = document.currentScript;
  if (current instanceof HTMLScriptElement) {
    return current;
  }

  const scripts = Array.from(
    document.querySelectorAll<HTMLScriptElement>("script[data-client-key]")
  );
  return scripts.length ? scripts[scripts.length - 1] : null;
}

function extractConfig(scriptEl: HTMLScriptElement): WidgetConfig | null {
  const clientKey = scriptEl.dataset.clientKey;
  if (!clientKey) {
    console.warn(
      "[ChatBotWidget] data-client-key attribute is required for auto-mounting."
    );
    return null;
  }

  const config: WidgetConfig = { clientKey };

  if (scriptEl.dataset.customUserId) {
    config.customUserId = scriptEl.dataset.customUserId;
  }
  if (scriptEl.dataset.apiUrl) {
    config.apiUrl = scriptEl.dataset.apiUrl;
  }

  return config;
}

function autoMountFromScript(scriptEl: HTMLScriptElement): void {
  if (scriptEl.dataset.autoMount === "false") {
    return;
  }

  const config = extractConfig(scriptEl);
  if (!config) {
    return;
  }

  const runMount = () => {
    let container: HTMLElement | null = null;
    let removeContainerOnDestroy = true;

    const targetSelector = scriptEl.dataset.target;
    if (targetSelector) {
      container = document.querySelector<HTMLElement>(targetSelector);
      if (!container) {
        console.warn(
          `[ChatBotWidget] Element not found for data-target selector "${targetSelector}".`
        );
        return;
      }
      removeContainerOnDestroy = false;
    } else {
      const containerId = scriptEl.dataset.containerId || "chat-bot-widget";
      container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);
      }
    }

    const instance = mount(container, {
      ...config,
      removeContainerOnDestroy,
    });

    autoMountedInstances.set(scriptEl, {
      instance,
      container,
      removeContainerOnDestroy,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runMount, { once: true });
  } else {
    runMount();
  }
}

function destroyAutoMounted(scriptEl?: HTMLScriptElement): void {
  if (!scriptEl) {
    autoMountedInstances.forEach((record) => {
      record.instance.destroy();
    });
    autoMountedInstances.clear();
    return;
  }

  const record = autoMountedInstances.get(scriptEl);
  if (!record) {
    return;
  }

  record.instance.destroy();
  autoMountedInstances.delete(scriptEl);
}

const existingGlobal = (window as any).ChatBotWidget ?? {};

const widgetApi = {
  ...existingGlobal,
  mount,
  destroy(scriptEl?: HTMLScriptElement) {
    destroyAutoMounted(scriptEl);
  },
  autoMount(scriptEl?: HTMLScriptElement) {
    const targetScript = scriptEl ?? resolveExecutingScript();
    if (targetScript) {
      autoMountFromScript(targetScript);
    }
  },
};

(window as any).ChatBotWidget = widgetApi;

const executingScript = resolveExecutingScript();
if (executingScript) {
  autoMountFromScript(executingScript);
}
