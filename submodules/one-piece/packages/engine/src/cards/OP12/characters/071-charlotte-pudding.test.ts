import { eb01Doma005, op01RadicalBeam029 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op12CharlottePudding071 } from "../../../../../cards/src/cards/OP12/characters/071-charlotte-pudding.ts";
import { op12Sanji070 } from "../../../../../cards/src/cards/OP12/characters/070-sanji.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-071 Charlotte Pudding", () => {
  test("searches the top four for either Sanji or an Event", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12CharlottePudding071],
      deck: [op12Sanji070, op01RadicalBeam029, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: op12CharlottePudding071.cost,
    });
    const sanjiId = engine.findCardInZone("south", "deck", op12Sanji070);
    const eventId = engine.findCardInZone("south", "deck", op01RadicalBeam029);

    engine.playCard(op12CharlottePudding071, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Pudding's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === sanjiId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eventId] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Pudding's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
  });
});
