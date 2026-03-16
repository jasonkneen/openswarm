export interface BrowserWebview extends HTMLElement {
  src: string;
  loadURL: (url: string) => Promise<void>;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  getURL: () => string;
  getTitle: () => string;
  capturePage: (rect?: { x: number; y: number; width: number; height: number }) => Promise<{
    toDataURL: () => string;
    toPNG: () => Buffer;
  }>;
  executeJavaScript: (code: string) => Promise<any>;
  sendInputEvent: (event: any) => void;
  addEventListener: (event: string, listener: (...args: any[]) => void) => void;
  removeEventListener: (event: string, listener: (...args: any[]) => void) => void;
}

const registry = new Map<string, BrowserWebview>();

export function registerWebview(browserId: string, wv: BrowserWebview): void {
  registry.set(browserId, wv);
}

export function unregisterWebview(browserId: string): void {
  registry.delete(browserId);
}

export function getWebview(browserId: string): BrowserWebview | undefined {
  return registry.get(browserId);
}

export function getAllWebviews(): Map<string, BrowserWebview> {
  return new Map(registry);
}
