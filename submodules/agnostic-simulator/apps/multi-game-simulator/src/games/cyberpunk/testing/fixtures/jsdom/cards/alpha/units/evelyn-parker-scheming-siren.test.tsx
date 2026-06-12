import { describe, test } from "vite-plus/test";
import { alphaArmoredMinotaur, alphaEvelynParkerSchemingSiren } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Evelyn Parker - Scheming Siren jsdom happy path", () => {
  test("draws after a rival steals a friendly Gig while Evelyn is spent", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitEvelynParkerSchemingSiren",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );
      const evelyn = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaEvelynParkerSchemingSiren.id,
      );
      const p1GigToSteal = (await pom.getGigDice(CYBERPUNK_P1))[0];
      if (!p1GigToSteal) {
        throw new Error("Expected P1 to have a Gig for Evelyn to react to.");
      }
      await pom.harness.dispatchEngine((engine) => {
        const state = engine.getState().G;
        state.cardIndex[evelyn.instanceId]!.meta.spent = true;
        state.gamePhase = "main";
        state.turnMetadata.activePlayerId = CYBERPUNK_P2;
        state.turnMetadata.pendingChoice = undefined;
      });

      await pom.attackRival(attacker.instanceId, CYBERPUNK_P2);
      await pom.resolveAttack(CYBERPUNK_P2);
      await pom.resolveAttack(CYBERPUNK_P1, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P2, { gigIdsToSteal: [p1GigToSteal.id] });

      await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
    } finally {
      view.unmount();
    }
  });
});
