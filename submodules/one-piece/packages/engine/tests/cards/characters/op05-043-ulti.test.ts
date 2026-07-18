import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op05Sakazuki041,
  op05Ulti043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-043 Ulti", () => {
  test("with a multicolored Leader privately takes up to one of the top 3, orders the rest, and chooses the deck end", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op05Sakazuki041,
      hand: [op05Ulti043],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op05Ulti043.cost,
    });
    const selectedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.getState().players.south.deck[3]!;

    engine.playCard(op05Ulti043, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Ulti's private deck choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates).toHaveLength(3);
    expect(search.candidates.every((candidate) => candidate.legal)).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Ulti's remainder order.");
    const orderedRemainder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: orderedRemainder },
      "south",
    );

    const position = engine.pendingDecision("effectSearchRemainderPosition", "south").steps[0];
    expect(position).toMatchObject({ kind: "chooseOption" });
    if (position?.kind !== "chooseOption") throw new Error("Expected Ulti's deck-end choice.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectSearchRemainderPosition", { optionId: "top" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    // Exact deck order is a narrow hidden-zone identity boundary.
    expect(engine.getState().players.south.deck).toEqual([...orderedRemainder, untouchedId]);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a multicolored Leader does not look at or move the deck", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op05Ulti043],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op05Ulti043.cost,
    });
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op05Ulti043, "south");

    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
