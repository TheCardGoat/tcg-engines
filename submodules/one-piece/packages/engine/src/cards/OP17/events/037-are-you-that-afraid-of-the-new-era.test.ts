import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-037 Are You That Afraid of the New Era?", () => {
  test("[Main] looks at 5 and takes a Red-Haired Pirates card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP17-037"],
        deck: ["OP13-013", "OP17-022", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP17-037");
    expect(
      engine.getView("south").players.south.trash.find((c) => c.cardId === "OP17-037")?.name,
    ).toBe("Are You That Afraid of the New Era?!!");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal.map((candidate) => candidate.publicInfo?.cardId)).toEqual(["OP17-022"]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [legal[0]!.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP17-022",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each(["leader", "character", "stage"])(
    "Counter pays by resting a %s and saves the Leader",
    (payment) => {
      const engine = OnePieceTestEngine.create(
        { hand: ["OP17-037"], character: ["EB01-005"], stage: "ST01-017", activeDon: 1 },
        { activeDon: 2 },
        { activeSeat: "north" },
      );
      const south = engine.getView("south").players.south;
      const paymentId =
        payment === "leader"
          ? engine.leader("south")
          : engine.findCardInZone(
              "south",
              payment === "stage" ? "stage" : "character",
              payment === "stage" ? "ST01-017" : "EB01-005",
            );
      engine.asNorth().attachDon(engine.leader("north"), 2);
      engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
      engine.asSouth().chooseCounter("OP17-037");
      engine.asSouth().acceptOptional();
      engine.resolveDecision("effectCostRestCards", { selectedIds: [paymentId] }, "south");
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [engine.leader("south")] },
        "south",
      );
      const after = engine.getView("south").players.south;
      expect(after.lifeCount).toBe(south.lifeCount);
      expect(after.leader.power).toBe(south.leader.power);
      const paid = [after.leader, ...after.characters, after.stage].find(
        (c) => c?.instanceId === paymentId,
      );
      expect(paid?.rested).toBe(true);
      expect(after.trash.map((c) => c.cardId)).toContain("OP17-037");
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("Counter can rest an active DON!! after paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-037"], activeDon: 2 },
      { activeDon: 2 },
      { activeSeat: "north" },
    );
    const before = engine.getView("south").players.south;
    engine.asNorth().attachDon(engine.leader("north"), 2);
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    engine.asSouth().chooseCounter("OP17-037");
    engine.asSouth().acceptOptional();
    const step = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (step?.kind !== "payCost") throw new Error("Expected rest-card payment.");
    const don = step.candidates.filter((candidate) => candidate.ref.id.startsWith("active-don:"));
    expect(don).toHaveLength(1);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [don[0]!.ref.id] }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    const after = engine.getView("south").players.south;
    expect(after.lifeCount).toBe(before.lifeCount);
    expect(after.activeDon).toBe(0);
    expect(after.restedDon).toBe(2);
    expect(after.leader.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter can decline its rest cost and the attack then deals damage", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-037"], activeDon: 1 },
      { activeDon: 2 },
      { activeSeat: "north" },
    );
    const before = engine.getView("south").players.south;
    engine.asNorth().attachDon(engine.leader("north"), 2);
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    engine.asSouth().chooseCounter("OP17-037");
    engine.asSouth().declineOptional();
    const after = engine.getView("south").players.south;
    expect(after.lifeCount).toBe(before.lifeCount - 1);
    expect(after.leader.rested).toBe(false);
    expect(after.leader.power).toBe(before.leader.power);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
