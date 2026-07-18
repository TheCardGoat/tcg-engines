import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01MonkeyDLuffy024,
  op01Shanks120,
  op08SSnake112,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-112 S-Snake", () => {
  test("on play restricts only a cost-6-or-less non-Luffy through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08SSnake112], activeDon: op08SSnake112.cost },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op01MonkeyDLuffy024, playedOnTurn: 0 },
          { card: op01Shanks120, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const luffyId = engine.findCardInZone("north", "character", op01MonkeyDLuffy024);
    const expensiveId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op08SSnake112, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected S-Snake's target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([luffyId, expensiveId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: targetId,
        targetId: engine.leader("south"),
      }).accepted,
    ).toBe(false);
  });

  test("Life Trigger activates the On Play restriction", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op08SSnake112] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Triggered On Play target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
