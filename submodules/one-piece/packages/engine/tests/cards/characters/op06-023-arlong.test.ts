import { describe, expect, test } from "vite-plus/test";
import { op06Arlong023, op06BearKing012, op06RaiseMax016, op06Ratchet014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-023 Arlong", () => {
  test("trashes a hand card to stop a rested opposing Leader through its next turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Arlong023, op06Ratchet014], activeDon: 4, life: [op06RaiseMax016] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const paymentId = engine.findCardInZone("south", "hand", op06Ratchet014);

    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.endTurn("north");

    engine.playCard(op06Arlong023, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Arlong's rested Leader target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "south",
    );

    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: engine.leader("north"),
        targetId: engine.leader("south"),
      }).accepted,
    ).toBe(false);

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    expect(engine.getView("north").players.north.leader.rested).toBe(true);
  });

  test("Life Trigger rests only an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op06BearKing012, playedOnTurn: 0 },
          { card: op06RaiseMax016, playedOnTurn: 0 },
        ],
      },
      { life: [op06Arlong023] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op06BearKing012);
    const eligibleId = engine.findCardInZone("south", "character", op06RaiseMax016);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const rest = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(rest).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (rest?.kind !== "selectEntity") throw new Error("Expected Arlong's Trigger target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Arlong023, op06Ratchet014], activeDon: 4, life: [op06RaiseMax016] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.endTurn("north");
    engine.playCard(op06Arlong023, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
