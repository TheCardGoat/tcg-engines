import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-002", () => {
  test("[On Play] reveals up to 1 Egghead or Straw Hat Crew card from the top 4 deck cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-002"],
        deck: ["EB04-052", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const eggheadId = engine.findCardInZone("south", "deck", "EB04-052");

    engine.playCard("EB04-002");
    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected the reveal choice.");
    const legalIds = reveal.candidates.filter((c) => c.legal).map((c) => c.ref.id);
    expect(legalIds).toEqual([eggheadId]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eggheadId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    const bottomOrder = order.candidates.map((c) => c.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(
      eggheadId,
    );
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(bottomOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the reveal places all 4 looked-at cards at the bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-002"],
        deck: ["EB04-052", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const eggheadId = engine.findCardInZone("south", "deck", "EB04-052");

    engine.playCard("EB04-002");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    const bottomOrder = order.candidates.map((c) => c.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).not.toContain(
      eggheadId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
