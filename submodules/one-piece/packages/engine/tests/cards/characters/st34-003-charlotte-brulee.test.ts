import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST34-003 Brulee", () => {
  test.each(["ST07-015", "ST34-005"])(
    "searches exact Big Mom card%s from3 and orders rest",
    (card) => {
      let e = OnePieceTestEngine.create({
        hand: ["ST34-003"],
        activeDon: 1,
        deck: ["ST02-002", card, "ST02-006", "ST02-012"],
      });
      const selected = e.findCardInZone("south", "deck", card);
      e.asSouth().play("ST34-003");
      const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("search");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([selected]);
      e.asSouth().chooseSearch(selected);
      const o = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
      if (o?.kind !== "orderItems") throw Error("order");
      const ids = o.candidates.map((c) => c.ref.id).reverse();
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asSouth().orderCards("effectSearchRemainderOrder", ids);
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(selected);
      expect(e.getState().players.south.deck.slice(-2)).toEqual(ids);
    },
  );
  test("declines optional search with eligible card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST34-003"],
      activeDon: 1,
      deck: ["ST34-005", "ST02-002", "ST02-006", "ST02-012"],
    });
    e.asSouth().play("ST34-003");
    e.asSouth().chooseNoSearch();
    const o = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (o?.kind !== "orderItems") throw Error("order");
    e.asSouth().orderCards(
      "effectSearchRemainderOrder",
      o.candidates.map((c) => c.ref.id),
    );
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(4);
  });
});
