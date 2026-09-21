import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("P-105", () => {
  test("[On Play] adds the top Life card to hand, then may give a rested DON!!", () => {
    // subject token bound in the decline test below
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
  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["P-105"], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("P-105");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "P-105",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const sabo = "P-105";
    const engine = OnePieceTestEngine.create(
      { hand: [sabo], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(sabo);
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(sabo);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
