import { describe, test } from "vite-plus/test";
import {
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailPanamPalmerNomadCavalry,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Panam Palmer - Nomad Cavalry (Retail) jsdom happy path", () => {
  test("spend ability leaves attached gear on the legend", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendPanamPalmerNomadCavalryRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const panam = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPanamPalmerNomadCavalry.id,
      );

      const unit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );

      // Unit starts without gear
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, unit.instanceId, 0);

      await pom.activateAbility(panam.instanceId, 0, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectLegendCardSpent(CYBERPUNK_P1, panam.instanceId, false);
      await pom.expectLegendCardAttachedGearCount(CYBERPUNK_P1, panam.instanceId, 1);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, unit.instanceId, 0);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
