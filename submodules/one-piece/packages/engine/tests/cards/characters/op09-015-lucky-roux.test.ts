import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Shanks120,
  op09LuckyRoux015,
  op09Shanks001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-015 Lucky.Roux", () => {
  test("blocks, then K.O.s an opposing base-power-6000-or-less Character when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op09Shanks001, character: [op09LuckyRoux015] },
      {
        character: [{ card: op01Shanks120, playedOnTurn: 0 }, eb01Doma005, eb01MountainGod018],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rouxId = engine.findCardInZone("south", "character", op09LuckyRoux015);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooPowerfulId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [rouxId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Lucky.Roux's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(rouxId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
