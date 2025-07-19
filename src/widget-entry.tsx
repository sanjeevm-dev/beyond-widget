import { createRoot } from "react-dom/client";
import App from "./App";

interface WidgetConfig {
  clientKey: string;
  customUserId?: string;
  apiUrl?: string;
}

interface WidgetInstance {
  destroy: () => void;
}

function mount(container: HTMLElement, config: WidgetConfig): WidgetInstance {
  const root = createRoot(container);
  root.render(
    <App clientKey={config.clientKey} customUserId={config.customUserId} apiUrl={config.apiUrl} />
  );
  return {
    destroy: () => {
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
  };
}

(window as any).ChatBotWidget = {
  mount,
}; 