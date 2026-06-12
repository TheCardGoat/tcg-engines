import { describe, test } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("River Ward - Detective on the Hunt (Retail) jsdom happy path", () => {
  test("spend plays a low-cost Gear from hand for free", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendRiverWardDetectiveOnTheHuntRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const river = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRiverWardDetectiveOnTheHunt.id,
      );

      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      expectEqual("River Ward hand before", handBefore, 1);

      await pom.activateAbility(river.instanceId, 1, CYBERPUNK_P1);

      // playCard with selection first creates chooseTarget for the gear in hand
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("River Ward eligible gear count", eligible.length, 1);
      await pom.resolveEffectTarget([eligible[0]!], CYBERPUNK_P1);

      // After target resolution, handlePlayCard creates chooseCardToPlay
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
      const playChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
      expectEqual("River Ward play choices count", playChoices.length, 1);
      await pom.resolveCardToPlay(playChoices[0]!, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectLegendCardSpent(CYBERPUNK_P1, river.instanceId, true);
      // Eddies unchanged because the gear is played for free
      await pom.expectEddies(CYBERPUNK_P1, 5);
      // Gear moved from hand to field (unattached since no attachTo was specified)
      await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, alphaKiroshiOptics.id);
      const handAfter = await pom.getHandSize(CYBERPUNK_P1);
      expectEqual("River Ward hand after", handAfter, 0);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
