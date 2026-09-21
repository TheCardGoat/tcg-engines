import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-037 The Outcome Will Tell Us Who's Strong and Who's Weak", () => {
  test("[Main] looks at 5, takes an East Blue card other than itself, and orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-037"],
        deck: ["OP13-013", "OP15-007", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP15-037");
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
    expect(south.hand).toHaveLength(1);
    expect(south.deckCount).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Trigger] draws 1 card when taken as Life damage", () => {
    const engine = OnePieceTestEngine.create(
      { life: ["OP15-037"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
  });
});
