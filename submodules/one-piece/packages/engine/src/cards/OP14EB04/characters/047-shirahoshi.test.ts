import {
  eb01Doma005,
  eb01MountainGod018,
  op01Jinbe014,
  op06Zeo028,
  op11Shirahoshi030,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Shirahoshi047 } from "../../../../../cards/src/cards/OP14EB04/characters/047-shirahoshi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-047 Shirahoshi", () => {
  test("on play draws one exact card then offers included Fish-Man or Merfolk Characters costing 3 or less", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Shirahoshi047, op06Zeo028, op11Shirahoshi030, op01Jinbe014, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op14eb04Shirahoshi047.cost,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const fishManId = engine.findCardInZone("south", "hand", op06Zeo028);
    const merfolkId = engine.findCardInZone("south", "hand", op11Shirahoshi030);
    const expensiveId = engine.findCardInZone("south", "hand", op01Jinbe014);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04Shirahoshi047, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Shirahoshi's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([fishManId, merfolkId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [merfolkId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(merfolkId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(fishManId);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Shirahoshi047], hand: [] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], hand: [] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shirahoshiId = engine.findCardInZone("south", "character", op14eb04Shirahoshi047);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shirahoshi's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shirahoshiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [shirahoshiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(shirahoshiId);
    expect(view.prompts).toHaveLength(0);
  });
});
