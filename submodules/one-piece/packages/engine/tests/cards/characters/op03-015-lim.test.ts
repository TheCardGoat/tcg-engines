import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Lim015, op04Mr5Gem072 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-015 Lim", () => {
  test("when K.O.'d as a Blocker on the opponent's turn, reduces an opposing card's power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03Lim015] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const limId = engine.findCardInZone("south", "character", op03Lim015);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [limId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Lim's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("north"), attackerId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "south",
    );

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(limId);
    expect(view.players.north.leader.power).toBe(3000);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.north.leader.power).toBe(5000);
  });

  test("does not trigger when K.O.'d during its controller's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03Lim015, { card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [op04Mr5Gem072], activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const limId = engine.findCardInZone("south", "character", op03Lim015);
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [limId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(limId);
    expect(view.players.north.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });
});
