import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10Marco055 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-055 Marco", () => {
  test("blocks, then returns an opposing cost-4-or-less Character after being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Marco055] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marcoId = engine.findCardInZone("south", "character", op10Marco055);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const returnId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [marcoId] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Marco's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([returnId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(marcoId);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      returnId,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
