import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-057 Dressrosa Kingdom", () => {
  test("[On Play] with a Dressrosa Leader resolves and places the Stage", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP15-039", hand: ["OP15-057", "EB01-005"], activeDon: 5 },
      {},
    );

    engine.playCard("OP15-057");
    expect(engine.getView("south").players.south.stage?.cardId).toBe("OP15-057");
    expect(engine.getView("south").players.south.handCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] without a {Dressrosa} Leader draws nothing", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP15-057", "EB01-005"], activeDon: 5 }, {});

    engine.playCard("OP15-057");

    expect(engine.getView("south").players.south.stage?.cardId).toBe("OP15-057");
    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each(["OP02-117", "OP15-057"])(
    "attack buff pays an Event or Stage discard: %s",
    (payment) => {
      const engine = OnePieceTestEngine.create(
        { stage: "OP15-057", hand: [payment, "EB01-005", "OP15-019"] },
        { activeDon: 2 },
      );
      const paymentId = engine.findCardInZone("south", "hand", payment);
      engine.endTurn("south");
      engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      const step = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
      if (step?.kind !== "payCost") throw new Error("Expected discard cost");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([
        paymentId,
        engine.findCardInZone("south", "hand", "OP15-019"),
      ]);
      engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [engine.leader("south")] },
        "south",
      );
      expect(engine.getView("south").players.south.stage?.rested).toBe(true);
      expect(
        engine.getView("south").players.south.trash.some((c) => c.instanceId === paymentId),
      ).toBe(true);
      expect(engine.getView("south").players.south.leader.power).toBe(7000);
    },
  );
  test("[On Your Opponent's Attack] may be declined without paying either cost or gaining power", () => {
    const stage = "OP15-057";
    const engine = OnePieceTestEngine.create(
      { stage, hand: ["OP02-117", "EB01-005"], activeDon: 2 },
      { activeDon: 2 },
    );
    engine.endTurn("south");
    const before = engine.getView("south").players.south;
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.stage?.cardId).toBe(stage);
    expect(after.stage?.rested).toBe(false);
    expect(after.hand.map((card) => card.instanceId)).toEqual(
      before.hand.map((card) => card.instanceId),
    );
    expect(after.trash).toEqual(before.trash);
    expect(after.activeDon).toBe(before.activeDon);
    expect(after.restedDon).toBe(before.restedDon);
    expect(after.leader.power).toBe(before.leader.power);
    engine.pendingDecision("battleCounter", "south");
  });
});
