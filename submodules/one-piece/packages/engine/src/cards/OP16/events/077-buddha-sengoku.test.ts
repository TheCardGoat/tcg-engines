import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-077 Buddha Sengoku", () => {
  test("[Main] looks at 5, may take a Navy card, orders the rest, then trashes 1 from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-077", "EB01-005"],
        deck: ["OP13-013", "OP16-063", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP16-077");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal.map((candidate) => candidate.publicInfo?.cardId)).toEqual(["OP16-063"]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [legal[0]!.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [trash.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-063");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] may take no searched card and still completes the remaining actions", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP16-077", "EB01-005"],
      deck: ["OP16-063", "OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
      activeDon: 1,
    });
    engine.playCard("OP16-077");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    expect(order.candidates).toHaveLength(5);
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );
    const south = engine.getView("south").players.south;
    expect(south.handCount).toBe(0);
    expect(south.deckCount).toBe(6);
    expect(south.trash.map((card) => card.cardId)).toContain("OP16-077");
    expect(south.trash.map((card) => card.cardId)).toContain("EB01-005");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
