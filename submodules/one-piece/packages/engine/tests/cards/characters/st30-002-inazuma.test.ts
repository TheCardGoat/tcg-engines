import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-002-inazuma", () => {
  test("search admits exact6000 Character and orders physical remainder", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST30-002"],
      activeDon: 1,
      deck: ["ST30-005", "ST21-006", "ST28-004", "ST21-016", "ST21-013", "ST21-005"],
    });
    e.playCard("ST30-002");
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("search");
    const selected = e.findCardInZone("south", "deck", "ST30-005");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([selected]);
    e.asSouth().chooseSearch(selected);
    const o = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (o?.kind !== "orderItems") throw Error("order");
    const ids = o.candidates.map((c) => c.ref.id).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    expect(e.getView("south").players.south.hand[0]?.instanceId).toBe(selected);
    /* Deck order is hidden from player views. */ expect(
      e.getState().players.south.deck.slice(-4),
    ).toEqual(ids);
  });
  test("declines optional search with qualifying card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST30-002"],
      activeDon: 1,
      deck: ["ST30-005", "ST21-005"],
    });
    e.playCard("ST30-002");
    e.asSouth().chooseNoSearch();
    const p = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    e.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: p.candidates.map((c) => c.ref.id) },
      "south",
    );
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(2);
  });
});
