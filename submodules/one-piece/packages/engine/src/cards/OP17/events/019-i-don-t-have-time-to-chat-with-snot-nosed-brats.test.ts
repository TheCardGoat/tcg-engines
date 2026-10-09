import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-019 I Don't Have Time to Chat With Snot-Nosed Brats", () => {
  test("[Main] looks at 5 and takes a Whitebeard Pirates card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP17-019"],
        deck: ["OP13-013", "OP16-003", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP17-019");
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

  test("[Main] may take no searched card and still completes the remaining actions", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP17-019"],
      deck: ["OP16-003", "OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
      activeDon: 1,
    });
    engine.playCard("OP17-019");
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
    expect(south.trash.map((card) => card.cardId)).toContain("OP17-019");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger gives the Leader1000 for the turn then expires", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP17-019", "EB01-025"] },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.endTurn("north");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
