import { isValidElement } from "react";
import { describe, expect, it } from "vite-plus/test";

import { VsAiPage } from "./pages/VsAi.page.tsx";
import { gundamSimulatorRoutes } from "./Router.tsx";

describe("Gundam standalone simulator router", () => {
  it("uses the VS AI deck picker for the root route", () => {
    const rootRoute = gundamSimulatorRoutes.find((route) => route.path === "/");

    expect(isValidElement(rootRoute?.element)).toBe(true);
    if (!isValidElement(rootRoute?.element)) {
      throw new Error("The root Gundam simulator route must render a React element.");
    }
    expect(rootRoute.element.type).toBe(VsAiPage);
  });

  it("opens named fixtures through a first-class test route", () => {
    const fixtureRoute = gundamSimulatorRoutes.find((route) => route.path === "/tests/:fixtureId");

    expect(isValidElement(fixtureRoute?.element)).toBe(true);
    if (!isValidElement(fixtureRoute?.element)) {
      throw new Error("The named Gundam fixture route must render a React element.");
    }
    expect(fixtureRoute.element.type).toBe(VsAiPage);
  });
});
