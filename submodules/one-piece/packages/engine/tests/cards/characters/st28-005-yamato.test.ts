import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st28-005-yamato", () => {
  test("search selects Wano cost2 or more and orders remainder", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST28-005"],
      activeDon: 1,
      deck: ["ST28-003", "ST28-005", "ST21-005", "ST09-006", "ST21-008", "ST21-006"],
    });
    e.playCard("ST28-005");
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("search");
    const selected = e.findCardInZone("south", "deck", "ST28-003");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toContain(selected);
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "deck", "ST28-005"),
    );
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "deck", "ST21-005"),
    );
    e.asSouth().chooseSearch(selected);
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    const ids = order.candidates.map((c) => c.ref.id).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    expect(e.getView("south").players.south.hand[0]?.instanceId).toBe(selected);
    /* Public view does not expose hidden deck order. */ expect(
      e.getState().players.south.deck.slice(-4),
    ).toEqual(ids);
  });
  test("declines optional search with a qualifying card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST28-005"],
      activeDon: 1,
      deck: ["ST28-003", "ST21-005"],
    });
    e.playCard("ST28-005");
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
  test("zero printed power gains own-turn +3000 only with two DON", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST28-005", playedOnTurn: 0 }], activeDon: 2 },
      {},
    );
    const y = e.findCardInZone("south", "character", "ST28-005");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(0);
    e.asSouth().attachDon(y, 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(1000);
    e.asSouth().attachDon(y, 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.asSouth().attack(y, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(0);
  });
});
