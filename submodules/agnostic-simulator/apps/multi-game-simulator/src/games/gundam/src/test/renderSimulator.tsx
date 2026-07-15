import { render, type RenderResult } from "@testing-library/react";
import { afterEach } from "vite-plus/test";
import { cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { SimulatorApp, type SimulatorAppProps } from "../SimulatorApp.tsx";
import type { DevRuntime } from "../game/dev-runtime.ts";

// Shared RTL + jsdom shims — declared here (rather than a separate setupFile)
// so that importing `renderSimulator` always installs them, regardless of
// whether tests run under the workspace-root or per-app vitest config.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: class {
      root = null;
      rootMargin = "";
      thresholds = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  });

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
}

afterEach(() => {
  cleanup();
});

type FixtureFactory = () => DevRuntime;

/**
 * Render <SimulatorApp> with a fixture. Mirrors the prop wiring in `App.tsx`
 * so tests stay aligned with the production harness.
 *
 *   renderSimulator(loadSetupDefault);
 *   renderSimulator(loadVsAiFixture, { viewerId: asViewerId("p2") });
 */
export function renderSimulator(
  fixture: FixtureFactory,
  overrides: Partial<Omit<SimulatorAppProps, "runtime" | "staticResources">> = {},
): RenderResult & { dev: DevRuntime } {
  const dev = fixture();
  const result = render(
    // `SimulatorApp` contains components that call `useNavigate`
    // (e.g. `MatchOverviewModalContainer`'s back-to-matchmaking
    // handler). In production the app mounts inside `react-router`'s
    // root; in tests we wrap with `MemoryRouter` so those hooks
    // resolve to a no-op in-memory navigator.
    <MemoryRouter initialEntries={["/vs-ai"]}>
      <SimulatorApp
        runtime={dev.runtime}
        staticResources={dev.staticResources}
        viewerId={overrides.viewerId ?? dev.p1Id}
        bot={overrides.bot ?? dev.bot}
      />
    </MemoryRouter>,
  );
  return Object.assign(result, { dev });
}
