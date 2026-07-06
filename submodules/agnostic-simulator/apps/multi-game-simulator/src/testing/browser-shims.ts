import { vi } from "vite-plus/test";

let computedStyleShimInstalled = false;

export function installBrowserShims() {
  if (!computedStyleShimInstalled) {
    const getComputedStyle = window.getComputedStyle.bind(window);
    window.getComputedStyle = (elt, pseudoElt) => getComputedStyle(elt, pseudoElt);
    computedStyleShimInstalled = true;
  }

  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};

  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}
