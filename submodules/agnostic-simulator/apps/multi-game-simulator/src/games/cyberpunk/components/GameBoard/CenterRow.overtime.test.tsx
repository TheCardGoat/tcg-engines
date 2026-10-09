// @vitest-environment jsdom

import { describe, expect, test } from "vite-plus/test";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";

describe("Cyberpunk overtime center row", () => {
  test.each(["desktop", "mobile"] as const)(
    "shows the overtime win condition in the %s center row",
    async (layout) => {
      ensureJsdomAnimationSupport();
      const view = renderCyberpunkSimulatorScenario({ scenarioId: "overtimeCenterRow", layout });
      try {
        const status = view.container.querySelector<HTMLElement>('[data-testid="overtime-status"]');
        expect(status?.dataset.active).toBe("true");
        expect(status?.textContent).toContain("7 GIGS WIN");
      } finally {
        view.unmount();
      }
    },
  );

  test("hides the countdown while either Fixer area has dice", () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "mobileLedgerThreeLegends",
      layout: "mobile",
    });
    try {
      const status = view.container.querySelector<HTMLElement>('[data-testid="overtime-status"]');
      expect(status).toBeNull();
    } finally {
      view.unmount();
    }
  });

  test.each(["desktop", "mobile"] as const)(
    "shows simple turn copy after both Fixer areas empty on %s",
    (layout) => {
      ensureJsdomAnimationSupport();
      const view = renderCyberpunkSimulatorScenario({ scenarioId: "overtimeCountdown", layout });
      try {
        const status = view.container.querySelector<HTMLElement>('[data-testid="overtime-status"]');
        expect(status?.dataset.active).toBe("false");
        expect(status?.textContent).toBe("OVERTIMEIN 2 TURNS");
      } finally {
        view.unmount();
      }
    },
  );
});
