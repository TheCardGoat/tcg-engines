import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-072 Hannyabal", () => {
  test("[On Play] looks at 5, may take an Impel Down card, and orders the rest to the bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-072"],
        deck: ["OP13-013", "OP16-026", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 2,
      },
      {},
    );

    engine.playCard("OP16-072");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal).toHaveLength(1);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [legal[0]!.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-026");
    expect(south.deckCount).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
