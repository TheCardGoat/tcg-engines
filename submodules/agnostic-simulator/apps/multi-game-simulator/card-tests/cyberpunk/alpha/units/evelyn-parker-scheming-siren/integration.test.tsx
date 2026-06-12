import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaArmoredMinotaur, alphaEvelynParkerSchemingSiren } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("unitEvelynParkerSchemingSiren fixture behavior", () => {
  test("Evelyn Parker - spent unit draws when rival steals a gig in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitEvelynParkerSchemingSiren" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      expectEqual("Evelyn initial choice", await pom.getPendingChoiceType(CYBERPUNK_P1), "gainGig");
      await pom.gainGig(await pom.pickFirstAllowedDie(CYBERPUNK_P1), CYBERPUNK_P1);

      const evelyn = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaEvelynParkerSchemingSiren.id,
      );
      const p2GigToSteal = (await pom.getGigDice(CYBERPUNK_P2))[0];
      if (!p2GigToSteal) {
        throw new Error("Expected a rival gig for Evelyn to steal first.");
      }

      await pom.attackRival(evelyn.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1, { gigIdsToSteal: [p2GigToSteal.id] });
      await pom.expectFieldCardSpent(CYBERPUNK_P1, evelyn.instanceId, true);

      await pom.passPhase(CYBERPUNK_P1);
      expectEqual("Evelyn P2 choice", await pom.getPendingChoiceType(CYBERPUNK_P2), "gainGig");
      await pom.gainGig(await pom.pickFirstAllowedDie(CYBERPUNK_P2), CYBERPUNK_P2);

      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );
      const p1GigToSteal = (await pom.getGigDice(CYBERPUNK_P1))[0];
      if (!p1GigToSteal) {
        throw new Error("Expected a friendly gig for P2 to steal.");
      }

      await pom.attackRival(minotaur.instanceId, CYBERPUNK_P2);
      await pom.resolveAttack(CYBERPUNK_P2);
      await pom.resolveAttack(CYBERPUNK_P1, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P2, { gigIdsToSteal: [p1GigToSteal.id] });

      expectEqual(
        "Evelyn hand after rival steal",
        await pom.getHandSize(CYBERPUNK_P1),
        handBefore + 1,
      );
      expectEqual("Evelyn deck after draw", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 1);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, evelyn.instanceId, true);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
