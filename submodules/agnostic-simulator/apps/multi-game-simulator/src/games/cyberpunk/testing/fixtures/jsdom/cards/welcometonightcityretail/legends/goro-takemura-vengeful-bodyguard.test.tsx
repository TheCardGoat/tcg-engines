import { describe, test } from "vite-plus/test";
import {
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Goro Takemura - Vengeful Bodyguard (Retail) jsdom happy path", () => {
  test("spend ability grants blocker and power with a Gig pair", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendGoroTakemuraVengefulBodyguardRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const goro = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailGoroTakemuraVengefulBodyguard.id,
      );

      const unit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );

      // Swordwise Huscle has base power 5
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, unit.instanceId, 5);

      await pom.activateAbility(goro.instanceId, 1, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectLegendCardSpent(CYBERPUNK_P1, goro.instanceId, true);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, unit.instanceId, "blocker", true);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, unit.instanceId, 6);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
