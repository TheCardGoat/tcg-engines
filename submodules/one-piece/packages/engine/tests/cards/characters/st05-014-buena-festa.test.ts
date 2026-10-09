import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST05-014 Buena Festa", () => {
  test("selects a FILM Event while excluding Buena copies and orders the remainder", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST05-014"],
        activeDon: 1,
        deck: ["ST05-014", "ST04-012", "ST05-017", "ST05-002", "ST05-014", "ST05-009"],
      },
      { deck: 20 },
    );
    const event = e.findCardInZone("south", "deck", "ST05-017");
    const ain = e.findCardInZone("south", "deck", "ST05-002");
    const sixth = e.findCardInZone("south", "deck", "ST05-009");
    e.asSouth().play("ST05-014");
    const search = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw Error("search");
    expect(search.candidates).toHaveLength(5);
    expect(search.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([event, ain]);
    expect(search.candidates.some((c) => c.ref.id === sixth)).toBe(false);
    e.resolveDecision("effectSearchSelection", { selectedIds: [event] }, "south");
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    const ids = order.candidates.map((c) => c.ref.id).reverse();
    expect(ids).toHaveLength(4);
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([event]);
    // Draw through the submitted order using normal turn commands. Leave one deck card to avoid an unrelated empty-deck defeat.
    for (const expected of [sixth, ...ids.slice(0, -1)]) {
      const before = e.getView("south").players.south.hand.map((c) => c.instanceId);
      e.asSouth().endTurn();
      e.asNorth().endTurn();
      expect(
        e
          .getView("south")
          .players.south.hand.filter((c) => !before.includes(c.instanceId))
          .map((c) => c.instanceId),
      ).toEqual([expected]);
    }
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines the search and places all five viewed cards in the chosen bottom order", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST05-014"],
        activeDon: 1,
        deck: ["ST05-014", "ST04-012", "ST05-017", "ST05-002", "ST05-014", "ST05-009"],
      },
      { deck: 20 },
    );
    const event = e.findCardInZone("south", "deck", "ST05-017");
    const ain = e.findCardInZone("south", "deck", "ST05-002");
    const sixth = e.findCardInZone("south", "deck", "ST05-009");
    e.asSouth().play("ST05-014");
    const search = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw Error("search");
    expect(search.candidates).toHaveLength(5);
    expect(search.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([event, ain]);
    expect(search.candidates.some((c) => c.ref.id === sixth)).toBe(false);
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    const ids = order.candidates.map((c) => c.ref.id).reverse();
    expect(ids).toHaveLength(5);
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([]);
    // Draw through the submitted order using normal turn commands. Leave one deck card to avoid an unrelated empty-deck defeat.
    for (const expected of [sixth, ...ids.slice(0, -1)]) {
      const before = e.getView("south").players.south.hand.map((c) => c.instanceId);
      e.asSouth().endTurn();
      e.asNorth().endTurn();
      expect(
        e
          .getView("south")
          .players.south.hand.filter((c) => !before.includes(c.instanceId))
          .map((c) => c.instanceId),
      ).toEqual([expected]);
    }
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
