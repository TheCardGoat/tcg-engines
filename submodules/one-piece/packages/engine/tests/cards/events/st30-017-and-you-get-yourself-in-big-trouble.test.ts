import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["main", "trigger"])(
  "%s searches exact6000 Character cards and orders the physical remainder",
  (mode) => {
    const e = OnePieceTestEngine.create(
      {
        hand: mode === "main" ? ["ST30-017"] : [],
        life: mode === "trigger" ? ["ST30-017"] : 4,
        activeDon: mode === "main" ? 1 : 0,
        deck: ["ST02-006", "ST01-012", "ST02-013", "ST02-002", "ST30-017", "ST02-012"],
      },
      {},
      { activeSeat: mode === "main" ? "south" : "north", firstPlayer: "south" },
    );
    const wanted = e.findCardInZone("south", "deck", "ST02-006");
    if (mode === "main") e.asSouth().play("ST30-017");
    else {
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
    }
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("Expected search selection");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([
      wanted,
      e.findCardInZone("south", "deck", "ST01-012"),
    ]);
    e.asSouth().chooseSearch(wanted);
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("Expected search remainder order");
    const ids = order.candidates.map((c) => c.ref.id).reverse();
    e.asSouth().orderCards("effectSearchRemainderOrder", ids);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(wanted);
    // The owner-selected bottom order is not exposed in a player view.
    expect(e.getState().players.south.deck.slice(-4)).toEqual(ids);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  },
);

test("declines the optional search and orders all five cards", () => {
  const e = OnePieceTestEngine.create({
    hand: ["ST30-017"],
    activeDon: 1,
    deck: ["ST02-006", "ST01-012", "ST02-013", "ST02-002", "ST01-011", "ST02-012"],
  });
  e.asSouth().play("ST30-017");
  e.asSouth().chooseSearch();
  const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
  if (order?.kind !== "orderItems") throw Error("Expected search remainder order");
  const ids = order.candidates.map((c) => c.ref.id).reverse();
  e.asSouth().orderCards("effectSearchRemainderOrder", ids);
  expect(e.getView("south").players.south.handCount).toBe(0);
  expect(e.getState().players.south.deck.slice(-5)).toEqual(ids);
});
