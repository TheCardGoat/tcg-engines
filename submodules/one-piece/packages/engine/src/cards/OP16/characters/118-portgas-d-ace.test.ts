import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-118 Portgas.D.Ace", () => {
  test("the counter of 8000-power Characters in hand becomes +2000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-118", "OP16-004"], activeDon: 5 },
      { character: ["OP16-065"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    // Sakazuki (8000) attacks the Leader (5000). With the boosted counter
    // 5000 + 2000 (Curiel) + 2000 (Ace's boost) = 9000 >= 8000: saved.
    engine.endTurn("south");
    engine.asNorth().attack("OP16-065", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-004");
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("without Ace in hand the same counter no longer saves the Leader", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-004"], activeDon: 5 },
      { character: ["OP16-065"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-065", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-004");
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
  });

  test("[On Play] looks at 5, may take a Whitebeard Pirates card, and orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-118"],
        deck: ["OP13-013", "OP16-003", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      {},
    );

    engine.playCard("OP16-118");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal.map((candidate) => candidate.publicInfo?.cardId)).toEqual(["OP16-003"]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [legal[0]!.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-003");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
