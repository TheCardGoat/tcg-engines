import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10Marco055 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-055 Marco", () => {
  test("blocks an attack, then on K.O. returns an opposing cost-4-or-less Character to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Marco055] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marcoId = engine.findCardInZone("south", "character", op10Marco055);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const returnId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Marco's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(marcoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [marcoId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Marco's return-to-hand choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(returnId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(marcoId);
    expect(engine.getState().players.north.hand).toContain(returnId);
    expect(view.prompts).toHaveLength(0);
  });
});
