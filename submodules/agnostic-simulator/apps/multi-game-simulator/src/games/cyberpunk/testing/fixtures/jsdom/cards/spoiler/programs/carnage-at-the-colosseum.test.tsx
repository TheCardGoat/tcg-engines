import { describe, test } from "vite-plus/test";
import { alphaArmoredMinotaur, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Carnage At The Colosseum jsdom happy path", () => {
  test("carnage At The Colosseum - reduced cost and weaker rival target", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progCarnageAtTheColosseum" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const program = expectDefined(
        "Carnage At The Colosseum in hand",
        (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
      );
      const lowlife = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaRuthlessLowlife.id,
      );
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );

      await pom.expectEddies(CYBERPUNK_P1, 4);
      await pom.expectGigCount(CYBERPUNK_P1, 3);
      expectEqual("Carnage fixture Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 21);

      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

      await pom.expectHandSize(CYBERPUNK_P1, 0);
      await pom.expectEddies(CYBERPUNK_P1, 0);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Carnage eligible rival target count", eligible.length, 1);
      if (!eligible.includes(lowlife.instanceId)) {
        throw new Error("Expected Ruthless Lowlife to be the only Carnage target.");
      }
      if (eligible.includes(minotaur.instanceId)) {
        throw new Error("Expected Armored Minotaur to be excluded from Carnage targets.");
      }

      await pom.resolveEffectTarget([lowlife.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldSize(CYBERPUNK_P2, 1);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaRuthlessLowlife.id);
      await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P2, minotaur.instanceId);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
