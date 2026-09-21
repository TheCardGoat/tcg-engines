// @vitest-environment jsdom
import { waitFor } from "@testing-library/react";
import { welcomeToNightCityRetailRoycePsychoOnTheEdge } from "@tcg/cyberpunk-cards";
import { describe, expect, test } from "vite-plus/test";

import { CYBERPUNK_P1 } from "../../cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

describe("legendCallEquippedSelfPay fixture behavior", () => {
  test("calls, spends, and preserves both attached Gear", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "legendCallEquippedSelfPay" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const royce = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRoycePsychoOnTheEdge.id,
      );
      const getSlot = () =>
        view.container.querySelector<HTMLElement>(
          `[data-testid="legend-slot"][data-card-id="${royce.instanceId}"]`,
        );
      const slot = getSlot();
      if (!slot) throw new Error("Expected equipped Royce in a Legend slot.");

      expect(slot.getAttribute("data-face-down")).toBe("true");
      expect(slot.getAttribute("data-spent")).toBe("false");
      expect(slot.getAttribute("data-attached-gear-count")).toBe("2");

      await pom.callLegend(royce.instanceId, CYBERPUNK_P1);
      await pom.expectLegendCardSpent(CYBERPUNK_P1, royce.instanceId, true);

      await waitFor(
        () => {
          const updatedSlot = getSlot();
          expect(updatedSlot?.getAttribute("data-face-down")).toBe("false");
          expect(updatedSlot?.getAttribute("data-spent")).toBe("true");
          expect(updatedSlot?.getAttribute("data-attached-gear-count")).toBe("2");
        },
        { timeout: 5_000 },
      );
      expect(getSlot()?.querySelectorAll('[data-testid="attached-gear"]')).toHaveLength(2);
      await pom.expectEddies(CYBERPUNK_P1, 0);
    } finally {
      view.unmount();
    }
  });
});
