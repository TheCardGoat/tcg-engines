import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailRoycePsychoOnTheEdge } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Royce - Psycho on the Edge (Retail) jsdom happy path", () => {
  test("goes solo with gear-scaled power", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendRoycePsychoOnTheEdgeRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const royce = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRoycePsychoOnTheEdge.id,
      );

      const legendView = await pom.getCardView(royce.instanceId, CYBERPUNK_P1);
      expectEqual(
        "Royce Retail legend effective power before GO SOLO",
        legendView.effectivePower,
        13,
      );
      expectEqual("Royce Retail legend attached gear count", legendView.attachedGearIds.length, 2);

      await pom.goSolo(royce.instanceId, CYBERPUNK_P1);

      await pom.expectEddies(CYBERPUNK_P1, 2);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, royce.instanceId, false);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, royce.instanceId, 2);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, royce.instanceId, 13);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, royce.instanceId, "goSolo", true);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
