import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailPeaceOffering } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Peace Offering (Retail) jsdom happy path", () => {
  test("play copies gig value and draws from value-pair", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progPeaceOfferingRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);
      const handBefore = await pom.getHandSize(CYBERPUNK_P1);

      const peace = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPeaceOffering.id,
      );

      await pom.playCardFromHand(peace.instanceId, CYBERPUNK_P1);

      // Binding targets all gigs; with only P1 gigs there are exactly 2
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Peace Offering eligible gig count", eligible.length, 2);
      await pom.resolveEffectTarget([eligible[0]!, eligible[1]!], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 1);
      // After copying gig value, a value-pair exists and a card is drawn
      await pom.expectHandSize(CYBERPUNK_P1, handBefore);
      // Peace Offering goes to trash
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPeaceOffering.id,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
