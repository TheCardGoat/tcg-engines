import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-026 Emporio.Ivankov", () => {
  test("[On Play] looks at 3, may take an Impel Down card to hand, and may play a cost-2-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-026"],
        deck: ["OP16-024", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 4,
      },
      {},
    );

    engine.playCard("OP16-026");

    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected the reveal choice.");
    const inazumaCandidate = reveal.candidates.find((candidate) => candidate.ref.id !== undefined);
    const lookedIds = reveal.candidates.map((candidate) => candidate.ref.id);
    expect(lookedIds).toHaveLength(3);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [lookedIds[0]!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Ivankov's play choice.");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-024");
    expect(inazumaCandidate).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the reveal keeps the deck intact modulo ordering", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-026"],
        deck: ["OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 4,
      },
      {},
    );

    engine.playCard("OP16-026");

    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected the reveal choice.");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    // The hand holds no cost-2-or-less Character, so the play auto-declines.
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).not.toContain(
      "OP16-024",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
