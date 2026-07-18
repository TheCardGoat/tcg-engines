import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Shirahoshi057,
  op03Arlong022,
  op06Dosun030,
  op06Hyouzou034,
  op07Aladine020,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-020 Aladine", () => {
  test("blocks, then on battle K.O. plays either a low-cost Fish-Man or Merfolk from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Arlong022,
        character: [op07Aladine020],
        hand: [op06Dosun030, eb01Shirahoshi057, op06Hyouzou034, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const aladineId = engine.findCardInZone("south", "character", op07Aladine020);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const fishManId = engine.findCardInZone("south", "hand", op06Dosun030);
    const merfolkId = engine.findCardInZone("south", "hand", eb01Shirahoshi057);
    const tooExpensiveId = engine.findCardInZone("south", "hand", op06Hyouzou034);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Aladine's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(aladineId);
    engine.resolveDecision("battleBlocker", { selectedIds: [aladineId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Aladine's On K.O. play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([fishManId, merfolkId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [merfolkId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(aladineId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(merfolkId);
    expect(view.prompts).toHaveLength(0);
  });
});
