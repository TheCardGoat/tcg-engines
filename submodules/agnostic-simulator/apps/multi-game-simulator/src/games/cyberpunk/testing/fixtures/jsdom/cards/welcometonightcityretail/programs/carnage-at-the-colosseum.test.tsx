import { describe, test } from "vite-plus/test";
import {
  alphaRuthlessLowlife,
  welcomeToNightCityRetailCarnageAtTheColosseum,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Carnage At The Colosseum (Retail) jsdom happy path", () => {
  test("play defeats a rival unit with less power than a friendly unit", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progCarnageAtTheColosseumRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);

      const carnage = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailCarnageAtTheColosseum.id,
      );

      await pom.playCardFromHand(carnage.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      // Only Ruthless Lowlife (power 4) is weaker than Armored Minotaur (power 7)
      expectEqual("Carnage eligible targets", eligible.length, 1);
      await pom.resolveEffectTarget([eligible[0]!], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      // Cost 6 minus 2 for friendly gigs with value >= 8 = 4 eddies spent
      await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 4);
      // Defeated rival unit goes to rival trash
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaRuthlessLowlife.id);
      // Carnage goes to P1 trash after resolving
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailCarnageAtTheColosseum.id,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
