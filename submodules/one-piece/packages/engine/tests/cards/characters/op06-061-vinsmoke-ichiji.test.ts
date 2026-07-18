import { describe, expect, test } from "vite-plus/test";
import { op06Arlong023, op06VinsmokeIchiji061 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-061 Vinsmoke Ichiji", () => {
  test("at equal DON!!, reduces an opposing Character and gains Rush for its play turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06VinsmokeIchiji061], activeDon: 7 },
      { character: [op06Arlong023], activeDon: 7 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", op06Arlong023);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op06VinsmokeIchiji061, "south");
    const ichijiId = engine.findCardInZone("south", "character", op06VinsmokeIchiji061);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Ichiji's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(4000);
    engine.declareAttack(ichijiId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("above the opponent's DON!! count, applies neither the reduction nor Rush", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06VinsmokeIchiji061], activeDon: 8 },
      { character: [op06Arlong023], activeDon: 7 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", op06Arlong023);

    engine.playCard(op06VinsmokeIchiji061, "south");
    const ichijiId = engine.findCardInZone("south", "character", op06VinsmokeIchiji061);

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(6000);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: ichijiId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });
});
