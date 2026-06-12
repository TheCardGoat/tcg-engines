import { describe, test } from "vite-plus/test";
import { alphaArmoredMinotaur, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Ruthless Lowlife jsdom happy path", () => {
  test("sets the stolen friendly Gig to value 1 while spent", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitRuthlessLowlife" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );
      const lowlife = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaRuthlessLowlife.id,
      );
      const p1GigToSteal = (await pom.getGigDice(CYBERPUNK_P1))[0];
      if (!p1GigToSteal) {
        throw new Error("Expected P1 to have a Gig for Ruthless Lowlife to affect.");
      }
      await pom.harness.dispatchEngine((engine) => {
        const state = engine.getState().G;
        state.cardIndex[lowlife.instanceId]!.meta.spent = true;
        state.gamePhase = "main";
        state.turnMetadata.activePlayerId = CYBERPUNK_P2;
        state.turnMetadata.pendingChoice = undefined;
      });

      await pom.attackRival(attacker.instanceId, CYBERPUNK_P2);
      await pom.resolveAttack(CYBERPUNK_P2);
      await pom.resolveAttack(CYBERPUNK_P1, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P2, { gigIdsToSteal: [p1GigToSteal.id] });

      const stolenD4 = (await pom.getGigDice(CYBERPUNK_P2)).find(
        (die) => die.id === p1GigToSteal.id,
      );
      if (!stolenD4) {
        throw new Error("Expected P2 to steal P1's d4 Gig.");
      }
      await pom.expectGigValue(stolenD4.id, 1);
    } finally {
      view.unmount();
    }
  });
});
