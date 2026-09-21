import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-118", () => {
  test("[On Play] DON!! 1: looks at 5 deck cards and adds up to 1 to hand", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-118", "EB01-005"],
        activeDon: 8,
        deck: ["OP12-013", "OP12-017", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const takeId = engine.findCardInZone("south", "deck", "OP12-013");
    const fillerId = engine.findCardInZone("south", "hand", "EB01-005");

    engine.playCard("OP15-118");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // DON!! 1 cost: return 1 active DON!! to the DON!! deck.
    const pay = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (pay?.kind !== "payCost") throw new Error("Expected the DON!! payment.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [pay.candidates[0]!.ref.id] },
      "south",
    );
    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected the reveal choice.");
    expect(reveal.candidates.map((c) => c.ref.id)).toContain(takeId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [takeId] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    const bottomOrder = order.candidates.map((c) => c.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    // The trailing "trash 1 card from your hand" clears a chosen hand card.
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [fillerId] }, "south");

    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([takeId]);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
      fillerId,
    );
    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").players.south.restedDon).toBe(6);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined keeps the DON!! and the deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-118"],
        activeDon: 8,
        deck: ["OP12-013", "OP12-017", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
      },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-118");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").players.south.activeDon).toBe(2);
    expect(engine.getView("south").players.south.restedDon).toBe(6);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-118"], activeDon: 8 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-118");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-118",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const enel = "OP15-118";
    const engine = OnePieceTestEngine.create(
      { hand: [enel], activeDon: 8 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(enel);
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(enel);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
