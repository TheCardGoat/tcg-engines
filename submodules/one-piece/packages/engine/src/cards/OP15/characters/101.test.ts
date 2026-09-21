import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-101", () => {
  test("is present on the field", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP15-101"], activeDon: 5 }, {});
    const cardId = engine.findCardInZone("south", "character", "OP15-101");
    expect(cardId).toBeDefined();
  });

  test("[On Play] trashes a hand card, reveals up to 2 targets, and orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-101", "OP13-013"],
        deck: ["OP15-111", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      {},
    );
    const nolandId = engine.findCardInZone("south", "deck", "OP15-111");

    engine.playCard("OP15-101");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone hand card auto-pays the trash cost.
    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected the reveal choice.");
    expect(reveal.candidates.map((c) => c.ref.id)).toContain(nolandId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [nolandId] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    const bottomOrder = order.candidates.map((c) => c.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((c) => c.instanceId)).toContain(nolandId);
    expect(south.trash.map((c) => c.cardId)).toContain("OP13-013");
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(bottomOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined looks at nothing", () => {
    const kalgara = "OP15-101";
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-101", "OP13-013"],
        deck: ["OP15-111", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      {},
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(kalgara);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.handCount).toBe(1);
    expect(south.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
