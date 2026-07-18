import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op02Yamakaji116,
  op03Issho078,
  op04Rebecca092,
  op05Rebecca091,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-091 Rebecca", () => {
  test("recovers a non-Rebecca black cost-3-to-7 Character, then plays a cost-3 Character rested", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Rebecca091],
      trash: [op02Yamakaji116, op04Rebecca092, op03Issho078],
      activeDon: op05Rebecca091.cost,
    });
    const eligibleId = engine.findCardInZone("south", "trash", op02Yamakaji116);
    const excludedNameId = engine.findCardInZone("south", "trash", op04Rebecca092);
    const tooExpensiveId = engine.findCardInZone("south", "trash", op03Issho078);

    engine.playCard(op05Rebecca091);
    const recover = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recover).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (recover?.kind !== "selectEntity") throw new Error("Expected Rebecca's trash target.");
    expect(recover.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(recover.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([excludedNameId, tooExpensiveId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Rebecca's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("blocks an attack through the defending player's public battle choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Rebecca091] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rebeccaId = engine.findCardInZone("south", "character", op05Rebecca091);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Rebecca's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(rebeccaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [rebeccaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(rebeccaId);
    expect(view.players.south.lifeCount).toBe(4);
  });
});
