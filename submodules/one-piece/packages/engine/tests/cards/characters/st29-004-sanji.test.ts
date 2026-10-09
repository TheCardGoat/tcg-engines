import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-004 Sanji", () => {
  test.each(["ST29-010", "ST01-014"])(
    "searches four for exact Straw Hat %s then orders other three",
    (card) => {
      let e = OnePieceTestEngine.create({
        hand: ["ST29-004"],
        activeDon: 4,
        deck: ["ST29-006", card, "ST02-002", "ST02-006", "ST02-012"],
      });
      const chosen = e.findCardInZone("south", "deck", card);
      e.asSouth().play("ST29-004");
      const search = e.pendingDecision("effectSearchSelection", "south").steps[0];
      if (search?.kind !== "selectEntity") throw Error("search");
      expect(search.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([chosen]);
      e.asSouth().chooseSearch(chosen);
      const p = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
      if (p?.kind !== "orderItems") throw Error("order");
      const ids = p.candidates.map((c) => c.ref.id).reverse();
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asSouth().orderCards("effectSearchRemainderOrder", ids);
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(chosen);
      expect(e.getState().players.south.deck.slice(-3)).toEqual(ids);
      expect(e.getView("south").players.south.deckCount).toBe(4);
    },
  );
  test("declines optional search with eligible card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST29-004"],
      activeDon: 4,
      deck: ["ST29-010", "ST02-002", "ST02-006", "ST02-012", "ST01-006"],
    });
    e.asSouth().play("ST29-004");
    e.asSouth().chooseSearch();
    const p = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    e.asSouth().orderCards(
      "effectSearchRemainderOrder",
      p.candidates.map((c) => c.ref.id),
    );
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(5);
  });
  test("Trigger discards then plays physical Sanji and resolves On Play", () => {
    const e = OnePieceTestEngine.create(
      {},
      {
        life: ["ST29-004", "ST02-002"],
        hand: ["ST02-006"],
        deck: ["ST29-010", "ST02-002", "ST02-006", "ST02-012", "ST01-006"],
      },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const life = e.findCardInZone("north", "life", "ST29-004");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter();
    e.asNorth().activateLifeTrigger();
    e.asNorth().acceptOptional();
    e.asNorth().chooseSearch("ST29-010");
    const p = e.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    e.asNorth().orderCards(
      "effectSearchRemainderOrder",
      p.candidates.map((c) => c.ref.id),
    );
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(life);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("ST02-006");
  });
  test("declines optional Trigger discard with payable hand", () => {
    const e = OnePieceTestEngine.create(
      {},
      { life: ["ST29-004", "ST02-002"], hand: ["ST02-006"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter();
    e.asNorth().activateLifeTrigger();
    e.asNorth().declineOptional();
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("ST29-004");
  });
});
