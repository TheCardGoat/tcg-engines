import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-006", () => {
  test("[On Play] reveals up to 1 [Lulucia Kingdom] from the top 7 deck cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-006"],
        deck: ["EB04-010", "OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const luluciaId = engine.findCardInZone("south", "deck", "EB04-010");

    engine.playCard("EB04-006");
    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected the reveal choice.");
    expect(reveal.candidates.map((c) => c.ref.id)).toContain(luluciaId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [luluciaId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    const bottomOrder = order.candidates.map((c) => c.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(
      luluciaId,
    );
    expect(engine.getState().players.south.deck.slice(-6)).toEqual(bottomOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("offers no reveal when none of the top 7 cards is [Lulucia Kingdom]", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-006"],
        deck: ["OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("EB04-006");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    const bottomOrder = order.candidates.map((c) => c.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
