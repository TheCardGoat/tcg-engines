import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05MonkeyDLuffy119, op01RadicalBeam029 } from "@tcg/op-cards";
import { op12Shakuyaku006 } from "../../../../../cards/src/cards/characters/op12-006-shakuyaku.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-006 Shakuyaku", () => {
  test("searches for either Monkey.D.Luffy or a red Event", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12Shakuyaku006],
      deck: [op05MonkeyDLuffy119, op01RadicalBeam029, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: op12Shakuyaku006.cost,
    });
    const luffyId = engine.findCardInZone("south", "deck", op05MonkeyDLuffy119);
    const eventId = engine.findCardInZone("south", "deck", op01RadicalBeam029);

    engine.playCard(op12Shakuyaku006, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Shakuyaku's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === luffyId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [luffyId] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Shakuyaku remainder order");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((c) => c.ref.id).reverse() },
      "south",
    );
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([luffyId]);
    expect(engine.getView("south").players.south.deckCount).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
