import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-013-monkey-d-garp", () => {
  test("searches all three names with cost<=5 and orders the remainder", () => {
    for (const selectedCard of ["ST13-007", "ST13-010", "ST13-015"]) {
      const e = OnePieceTestEngine.create({
        hand: ["ST13-013"],
        activeDon: 1,
        deck: ["ST13-007", "ST13-010", "ST13-015", "ST10-006", "ST02-002", "ST02-006"],
      });
      e.playCard("ST13-013", "south");
      const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("search");
      expect(
        step.candidates.find((c) => c.ref.id === e.findCardInZone("south", "deck", "ST10-006"))
          ?.legal,
      ).toBe(false);
      expect(
        step.candidates.find((c) => c.ref.id === e.findCardInZone("south", "deck", "ST02-002"))
          ?.legal,
      ).toBe(false);
      const selected = e.findCardInZone("south", "deck", selectedCard);
      if (!selected) throw Error("candidate");
      e.resolveDecision("effectSearchSelection", { selectedIds: [selected] }, "south");
      const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
      if (order?.kind !== "orderItems") throw Error("order");
      const ids = order.candidates.map((c) => c.ref.id).reverse();
      e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([selectedCard]);
      expect(e.getState().players.south.deck.slice(-4)).toEqual(ids);
      expect(e.getState().cards[e.getState().players.south.deck[0]!]!.cardId).toBe("ST02-006");
    }
  });
  test("declines the search and places all five at the bottom", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST13-013"],
      activeDon: 1,
      deck: ["ST13-007", "ST13-010", "ST13-015", "ST10-006", "ST02-002", "ST02-006"],
    });
    e.playCard("ST13-013", "south");
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    e.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((c) => c.ref.id) },
      "south",
    );
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(6);
  });
});
