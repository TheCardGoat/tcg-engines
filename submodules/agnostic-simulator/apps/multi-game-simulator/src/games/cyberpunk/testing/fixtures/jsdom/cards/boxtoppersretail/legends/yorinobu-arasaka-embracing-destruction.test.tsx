import { describe, test } from "vite-plus/test";
import { alphaArmoredMinotaur, alphaCorpoSecurity } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Yorinobu Arasaka - Embracing Destruction (Retail) jsdom happy path", () => {
  test("draws and discards on the first friendly Arasaka attack", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendYorinobuArasakaEmbracingDestructionRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaArmoredMinotaur.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.expectHandSize(CYBERPUNK_P1, 2);
      expectEqual("Yorinobu starting deck", await pom.getDeckSize(CYBERPUNK_P1), 37);

      await pom.attackUnit(minotaur.instanceId, defender.instanceId, CYBERPUNK_P1);

      await pom.expectHandSize(CYBERPUNK_P1, 3);
      expectEqual("Yorinobu deck after draw", await pom.getDeckSize(CYBERPUNK_P1), 36);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const discardChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Yorinobu discard choices", discardChoices.length, 3);
      await pom.resolveDiscardFromHand([discardChoices[0]!], CYBERPUNK_P1);

      await pom.expectHandSize(CYBERPUNK_P1, 2);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
