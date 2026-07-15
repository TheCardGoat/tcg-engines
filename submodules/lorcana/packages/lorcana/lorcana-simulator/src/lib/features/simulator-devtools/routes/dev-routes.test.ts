import { describe, expect, it } from "bun:test";
import { LORCANA_REGRESSION_FIXTURE_LIST } from "@/features/simulator-devtools/fixtures/regressions";
import {
  generalFixtureRouteLinks,
  regressionFixtureCount,
  regressionRouteLink,
  staticRouteLinks,
  visualValidationRouteLinks,
} from "./dev-routes.js";

describe("dev-routes", () => {
  it("keeps general fixture links separate from the regression index link", () => {
    expect(staticRouteLinks.some((route) => route.href === "/tests/regressions")).toBe(false);
    expect(generalFixtureRouteLinks.some((route) => route.href === "/tests/regressions")).toBe(
      false,
    );
    expect(
      generalFixtureRouteLinks.some((route) => route.href.includes("/tests/regressions/")),
    ).toBe(false);
    expect(regressionRouteLink.href).toBe("/tests/regressions");
    expect(regressionFixtureCount).toBe(LORCANA_REGRESSION_FIXTURE_LIST.length);
  });

  it("exposes the Hades takeover visual validation link", () => {
    expect(visualValidationRouteLinks).toContainEqual({
      href: "/tests/test?fixtureId=triage-2026-05-17-hades-target-clarity&view=playerOne&visual=hades-target-clarity&aiPlayMode=step",
      label: "Hades target clarity - take over opponent",
      description:
        "Open the Hades - Looking for a Deal repro from the Hades player's view, then take control of the AI opponent. Expected: only the opponent view shows the Simba - Protective Cub choice prompt.",
    });
  });
});
