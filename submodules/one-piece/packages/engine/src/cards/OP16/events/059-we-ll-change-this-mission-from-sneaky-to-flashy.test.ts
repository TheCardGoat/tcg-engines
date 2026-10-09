import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-059 We'll Change This Mission From Sneaky to Flashy", () => {
  test("[Main] resting 7 DON!! looks at 5 and plays up to 2 Impel Down Characters of 6000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-059"],
        deck: ["OP16-042", "OP13-013", "OP16-024", "OP13-013", "OP13-013"],
        activeDon: 8,
      },
      {},
    );

    engine.playCard("OP16-059");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal).toHaveLength(2);
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: legal.map((candidate) => candidate.ref.id) },
      "south",
    );

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const chars = engine.getView("south").players.south.characters.map((c) => c?.cardId);
    expect(chars).toContain("OP16-042");
    expect(chars).toContain("OP16-024");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] decline path (subject-bound)", () => {
    const flashy = "OP16-059";
    const engine = OnePieceTestEngine.create({ hand: [flashy], activeDon: 9 }, {});
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(flashy);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((c) => c.cardId)).toContain(flashy);
    expect(south.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("Counter gives the Leader battle power without the Main rest cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP16-059", "ST02-002"], activeDon: 1 },
      { activeDon: 2 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attachDon(e.leader("north"), 2);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP16-059");
    expect(e.getView("south").players.south.leader.power).toBe(8000);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
