import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05CaptainMckinley112,
  op05UpperYard117,
  op06Raki113,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-112 Captain McKinley", () => {
  test("blocks, then plays only a cost-1 included Sky Island Character when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05CaptainMckinley112, playedOnTurn: 0 }],
        hand: [op06Raki113, op05UpperYard117, eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mckinleyId = engine.findCardInZone("south", "character", op05CaptainMckinley112);
    const rakiId = engine.findCardInZone("south", "hand", op06Raki113);
    const excludedIds = [
      engine.findCardInZone("south", "hand", op05UpperYard117),
      engine.findCardInZone("south", "hand", eb01MountainGod018),
      engine.findCardInZone("south", "hand", eb01Doma005),
    ];
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected McKinley's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(mckinleyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [mckinleyId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected McKinley's On K.O. play.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([rakiId]);
    for (const id of excludedIds)
      expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(id);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [rakiId] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mckinleyId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(rakiId);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
