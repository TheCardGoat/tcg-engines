import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("P-105", () => {
  test("[On Play] adds the top Life card to hand, then may give a rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["P-105"], activeDon: 6, life: ["OP12-013", "OP12-017"] },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("P-105");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");

    expect(engine.getView("south").players.south.hand.map((c) => c.cardId)).toContain("OP12-013");
    expect(engine.getView("south").players.south.lifeCount).toBe(1);

    const give = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (give?.kind !== "chooseOption") throw new Error("Expected the DON!! count choice.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    // The given DON!! lands on the chosen Leader or Character.
    const giveTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (giveTarget?.kind !== "selectEntity") throw new Error("Expected the DON!! target.");
    const leaderId = engine.getView("south").players.south.leader.instanceId;
    if (!leaderId) throw new Error("Expected the Leader instance.");
    expect(giveTarget.candidates.map((c) => c.ref.id)).toContain(leaderId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined adds no Life card to hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["P-105"], activeDon: 6, life: ["OP12-013", "OP12-017"] },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("P-105");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("On Play can pay the physical bottom Life card after a saved choice and give zero DON", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-105"],
      activeDon: 4,
      life: ["ST01-002", "ST01-003"],
    });
    e.playCard("P-105");
    e.asSouth().acceptOptional();
    const restored = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    restored.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    restored.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(restored.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST01-003"]);
    expect(restored.getView("south").players.south).toMatchObject({
      lifeCount: 1,
      activeDon: 0,
      restedDon: 4,
    });
    expect(restored.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(restored.getView("south").prompts).toHaveLength(0);
  });

  test("with zero Life the optional payment cannot grant a rested DON", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-105"], activeDon: 4, life: 0 });
    e.playCard("P-105");
    expect(e.getView("south").players.south).toMatchObject({
      lifeCount: 0,
      activeDon: 0,
      restedDon: 4,
    });
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
