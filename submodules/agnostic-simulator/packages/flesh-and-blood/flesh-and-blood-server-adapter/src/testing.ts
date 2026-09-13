import { pilferTheTombBlue } from "@tcg/flesh-and-blood-cards/cards/instants/pilfer-the-tomb";
import { sigilOfSolaceRed } from "@tcg/flesh-and-blood-cards/cards/instants/sigil-of-solace";
import { rhinar } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { buildInteractionSubmission, type EngineInteractionView } from "@tcg/protocol";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import { fleshAndBloodCreateServerEngine } from "./engine-lifecycle.ts";

/**
 * Adapter-owned persistence fixture: CR 5.1.5 reverses an announced play when
 * its selected modes cannot supply all required targets. Platform tests use the
 * actual command DTOs while card definitions and native setup stay game-owned.
 */
export async function createRulesReversalFixture() {
  const actorId = "player-1";
  const opponentId = "player-2";
  const cardsMaps: CardsMaps = {
    cardInstances: {
      rhinar: rhinar.canonicalId,
      bravo: bravo.canonicalId,
      pilfer: pilferTheTombBlue.canonicalId,
      sigil: sigilOfSolaceRed.canonicalId,
    },
    owners: { [actorId]: ["rhinar", "pilfer"], [opponentId]: ["bravo", "sigil"] },
  };
  const engine = await fleshAndBloodCreateServerEngine({
    gameSlug: "flesh-and-blood",
    seed: "reversal",
    player1Id: actorId,
    player2Id: opponentId,
    firstTurnPlayerId: opponentId,
    cardsMaps,
  });
  return {
    engine,
    cardsMaps,
    actorId,
    opponentId,
    // Play and resolve the real instant to seed the opposing graveyard through
    // public moves, then pass priority to the player announcing Pilfer.
    prepare: [
      { actorId: opponentId, moveType: "begin-play", payload: { instanceId: "sigil" } },
      { actorId: opponentId, moveType: "pass", payload: {} },
      { actorId, moveType: "pass", payload: {} },
      { actorId: opponentId, moveType: "pass", payload: {} },
    ],
    begin: { moveType: "begin-play", payload: { instanceId: "pilfer" } },
    chooseModes(view: EngineInteractionView) {
      const action = view.actions[0];
      const input = action?.inputs[0];
      if (!action || input?.kind !== "option-selection") throw new Error("Expected mode selection");
      return buildInteractionSubmission({
        view,
        action,
        values: { answer: input.options.map((option) => option.id) },
      });
    },
    chooseTarget(view: EngineInteractionView) {
      const action = view.actions[0];
      const input = action?.inputs[0];
      if (!action || input?.kind !== "entity-selection" || !input.candidates[0])
        throw new Error("Expected target selection");
      return buildInteractionSubmission({
        view,
        action,
        values: { answer: [input.candidates[0].entity.instanceId] },
      });
    },
  };
}
