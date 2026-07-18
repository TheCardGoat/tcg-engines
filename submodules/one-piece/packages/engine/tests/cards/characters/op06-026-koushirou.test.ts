import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op06Dosun030,
  op06Gyro027,
  op06IkarosMuch024,
  op06Koushirou026,
  op07MonkeyDDragon015,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-026 Koushirou", () => {
  test("sets only an effective cost-4-or-less Slash Character active and blocks Leader attacks", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Koushirou026],
        character: [
          { card: op06Gyro027, rested: true, playedOnTurn: 0 },
          { card: op06IkarosMuch024, rested: true, playedOnTurn: 0 },
          { card: op06Dosun030, rested: true, playedOnTurn: 0 },
        ],
        activeDon: op06Koushirou026.cost,
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const gyroId = engine.findCardInZone("south", "character", op06Gyro027);
    const expensiveId = engine.findCardInZone("south", "character", op06IkarosMuch024);
    const wrongAttributeId = engine.findCardInZone("south", "character", op06Dosun030);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op06Koushirou026, "south");
    const ready = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ready?.kind).toBe("selectEntity");
    if (ready?.kind !== "selectEntity") throw new Error("Expected Koushirou's Slash target.");
    expect(ready).toMatchObject({ min: 0, max: 1 });
    expect(ready.candidates.map((candidate) => candidate.ref.id)).toContain(gyroId);
    expect(ready.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([expensiveId, wrongAttributeId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [gyroId] }, "south");

    expect(engine.getState().cards[gyroId]?.rested).toBe(false);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: engine.leader("south"),
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: gyroId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
    engine.declareAttack(gyroId, opposingId, "south");
  });

  test("also stops a Rush Character played after Koushirou from attacking a Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Koushirou026, op07MonkeyDDragon015],
        activeDon: op06Koushirou026.cost + op07MonkeyDDragon015.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op06Koushirou026, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.playCard(op07MonkeyDDragon015, "south");
    const dragonId = engine.findCardInZone("south", "character", op07MonkeyDDragon015);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: dragonId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
  });
});
