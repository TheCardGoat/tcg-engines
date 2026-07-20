import {
  eb01Doma005,
  eb01MountainGod018,
  op01Jinbe014,
  op06Zeo028,
  op11Shirahoshi030,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Aladine043 } from "../../../../../cards/src/cards/OP14EB04/characters/043-aladine.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-043 Aladine", () => {
  test("on play offers included Fish-Man or Merfolk Characters costing 3 or less from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Aladine043, op06Zeo028, op11Shirahoshi030, op01Jinbe014, eb01Doma005],
      activeDon: op14eb04Aladine043.cost,
    });
    const fishManId = engine.findCardInZone("south", "hand", op06Zeo028);
    const merfolkId = engine.findCardInZone("south", "hand", op11Shirahoshi030);
    const expensiveId = engine.findCardInZone("south", "hand", op01Jinbe014);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04Aladine043, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Aladine's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([fishManId, merfolkId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [fishManId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(fishManId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(merfolkId);
    expect(view.prompts).toHaveLength(0);
  });

  test("draws one exact card for its controller when K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Aladine043, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const aladineId = engine.findCardInZone("south", "character", op14eb04Aladine043);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, aladineId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(aladineId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });
});
