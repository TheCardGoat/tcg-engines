/**
 * jsdom render helper for Flesh and Blood simulator integration tests.
 *
 * Boots the **shipped** practice play surface (`FleshAndBloodPracticePage`)
 * against a production engine scenario — not a hand-built fake board.
 */
import { cleanup, render, type RenderResult } from "@testing-library/react";
import { HeadlessMantineProvider } from "@mantine/core";
import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { installBrowserShims } from "../../../testing/browser-shims";
import { FleshAndBloodSimulatorProviders } from "../App";
import { FleshAndBloodPracticePage } from "../Practice.page";
import { createFabSimulatorPom, type FabSimulatorPom } from "./fab-simulator-pom";

export interface RenderFabSimulatorOptions {
  /** Engine scenario id from `engineScenarios.ts` (e.g. `dual-target-open`). */
  readonly scenarioId: string;
  /** Viewport layout. Defaults to desktop so match-actions stay in DOM. */
  readonly layout?: "desktop" | "mobile";
  /** Query overrides (e.g. `ai=pass-only`). */
  readonly search?: string;
}

export interface RenderFabPracticeOptions {
  /** Viewport layout. Defaults to desktop so match-actions stay in DOM. */
  readonly layout?: "desktop" | "mobile";
  /** Query overrides, including an encoded imported deck. */
  readonly search?: string;
}

export interface FabSimulatorRender {
  readonly pom: FabSimulatorPom;
  readonly view: RenderResult;
  readonly dom: TestingLibraryDomDriver;
  readonly unmount: () => void;
}

/**
 * Render `/flesh-and-blood/simulator/tests/:scenarioId` through the real
 * practice chrome and return a fluent {@link FabSimulatorPom}.
 */
export function renderFabSimulatorScenario(options: RenderFabSimulatorOptions): FabSimulatorRender {
  const search = normalizeSearch(options.search);
  return renderFabSimulatorPath(
    `/flesh-and-blood/simulator/tests/${options.scenarioId}${search}`,
    options.layout,
  );
}

/** Render the ordinary/imported practice route through the same shipped chrome. */
export function renderFabSimulatorPractice(
  options: RenderFabPracticeOptions = {},
): FabSimulatorRender {
  const search = normalizeSearch(options.search);
  return renderFabSimulatorPath(
    `/flesh-and-blood/simulator/play/practice${search}`,
    options.layout,
  );
}

function normalizeSearch(search: string | undefined): string {
  return search?.startsWith("?") ? search : search ? `?${search}` : "";
}

function renderFabSimulatorPath(
  path: string,
  requestedLayout: "desktop" | "mobile" = "desktop",
): FabSimulatorRender {
  installBrowserShims();

  const layout = requestedLayout;
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  window.innerWidth = layout === "mobile" ? 390 : 1440;
  window.innerHeight = layout === "mobile" ? 844 : 900;
  window.dispatchEvent(new Event("resize"));

  const view = render(
    <HeadlessMantineProvider>
      <MemoryRouter initialEntries={[path]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/tests/:fixtureId"
              element={<FleshAndBloodPracticePage />}
            />
            <Route
              path="/flesh-and-blood/simulator/play/practice"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>
    </HeadlessMantineProvider>,
  );

  const dom = new TestingLibraryDomDriver(view.container);
  const pom = createFabSimulatorPom(dom);

  const unmount = () => {
    view.unmount();
    cleanup();
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
    window.dispatchEvent(new Event("resize"));
  };

  return { pom, view, dom, unmount };
}

/** Convenience wrapper used by tests that only need providers (no router). */
export function FabTestProviders({ children }: { children: ReactNode }) {
  return (
    <HeadlessMantineProvider>
      <FleshAndBloodSimulatorProviders>{children}</FleshAndBloodSimulatorProviders>
    </HeadlessMantineProvider>
  );
}
