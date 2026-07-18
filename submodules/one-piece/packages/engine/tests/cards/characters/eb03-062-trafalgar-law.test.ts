import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb03TrafalgarLaw062,
  op04TrafalgarLaw087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-062 Trafalgar Law", () => {
  test("pays its hand and self-trash costs, adds top deck to Life, then plays only a cost-7-or-less Trafalgar Law", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb03TrafalgarLaw062],
      hand: [op04TrafalgarLaw087, eb03TrafalgarLaw062, eb01Doma005],
      deck: [eb01Fourtricks025, eb01Doma005],
    });
    const lawId = engine.findCardInZone("south", "character", eb03TrafalgarLaw062);
    const playableLawId = engine.findCardInZone("south", "hand", op04TrafalgarLaw087);
    const expensiveLawId = engine.findCardInZone("south", "hand", eb03TrafalgarLaw062);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const deckTopId = engine.getState().players.south.deck[0]!;

    engine.activateEffect(lawId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Law's hand play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playableLawId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveLawId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playableLawId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([lawId, discardedId]),
    );
    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === playableLawId),
    ).toBeDefined();
    expect(view.prompts).toHaveLength(0);
  });

  test("has Rush and can attack an opposing Character on the turn it enters play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb03TrafalgarLaw062], activeDon: eb03TrafalgarLaw062.cost },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(eb03TrafalgarLaw062, "south");
    const lawId = engine.findCardInZone("south", "character", eb03TrafalgarLaw062);
    engine.declareAttack(lawId, targetId, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});
