import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-119 Marshall.D.Teach", () => {
  test("[On Play] looks at 3, may put a card on top of Life, and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-119"],
        deck: ["OP13-013", "OP16-004", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 8,
      },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard("OP16-119");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const curiel = search.candidates.find(
      (candidate) => candidate.publicInfo?.cardId === "OP16-004",
    );
    if (!curiel) throw new Error("Expected Curiel among the looked cards.");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [curiel.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore + 1);
    const state = engine.getState();
    expect(state.cards[state.players.south.life[0]!]!.cardId).toBe("OP16-004");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the Life add keeps the Life area untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-119"],
        deck: ["OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 8,
      },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard("OP16-119");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
