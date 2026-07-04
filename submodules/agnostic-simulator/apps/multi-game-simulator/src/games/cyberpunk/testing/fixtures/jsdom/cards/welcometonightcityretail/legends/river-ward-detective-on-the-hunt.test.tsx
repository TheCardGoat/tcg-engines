import { describe, test } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  alphaSwordwiseHuscle,
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
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const gear = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaKiroshiOptics.id,
      );

      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      expectEqual("River Ward hand before", handBefore, 1);

      await pom.activateAbility(river.instanceId, 1, CYBERPUNK_P1);

      // The activated ability first chooses the friendly Unit/Legend host.
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!eligible.includes(host.instanceId)) {
        throw new Error("Expected River Ward to offer Swordwise Huscle as an attachment host.");
      }
      await pom.resolveEffectTarget([host.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const gearChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!gearChoices.includes(gear.instanceId)) {
        throw new Error("Expected River Ward to offer Kiroshi Optics as the free Gear.");
      }
      await pom.resolveEffectTarget([gear.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
      const playChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
      if (!playChoices.includes(gear.instanceId)) {
        throw new Error("Expected River Ward to play Kiroshi Optics for free.");
      }
      await pom.resolveCardToPlay(gear.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectLegendCardSpent(CYBERPUNK_P1, river.instanceId, true);
      // Eddies unchanged because the gear is played for free
      await pom.expectEddies(CYBERPUNK_P1, 5);
      const attachedGear = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaKiroshiOptics.id,
      );
      expectEqual("River Ward attached gear host", attachedGear.attachedToId, host.instanceId);
      const handAfter = await pom.getHandSize(CYBERPUNK_P1);
      expectEqual("River Ward hand after", handAfter, 0);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
