import { describe, expect, test } from "vite-plus/test";
import { op06VinsmokeNiji064, op06VinsmokeNiji065, op06VinsmokeReiju042 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-064 Vinsmoke Niji", () => {
  test("with a compound GERMA 66 Leader, returns DON!! and trashes itself to play cost-5 Niji", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06VinsmokeReiju042,
      character: [op06VinsmokeNiji064],
      trash: [op06VinsmokeNiji065],
      activeDon: 1,
      restedDon: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op06VinsmokeNiji064);
    const playedId = engine.findCardInZone("south", "trash", op06VinsmokeNiji065);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Niji's cost-5 play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playedId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playedId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
  });

  test("with a non-GERMA Leader, pays both costs before the post-colon play condition fails", () => {
    const engine = OnePieceTestEngine.create({
      character: [op06VinsmokeNiji064],
      trash: [op06VinsmokeNiji065],
      activeDon: 1,
      restedDon: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op06VinsmokeNiji064);
    const unplayedId = engine.findCardInZone("south", "trash", op06VinsmokeNiji065);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sourceId, unplayedId]),
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
