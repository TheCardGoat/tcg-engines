import { describe, test } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailCyberpsychosis,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Cyberpsychosis (Retail) jsdom happy path", () => {
  test("equipped unit with gears is present for quick-cast", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progCyberpsychosisRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      // Card is in hand
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailCyberpsychosis.id,
      );

      // Equipped unit has 2 gears attached
      const unit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, unit.instanceId, 2);
      await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, alphaKiroshiOptics.id);
      await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, alphaMantisBlades.id);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
