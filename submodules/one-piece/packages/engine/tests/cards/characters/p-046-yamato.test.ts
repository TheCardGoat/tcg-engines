import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-046-yamato", () => {
  test("orders the entire remaining hand at bottom then draws exactly that many", () => {
    let e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["P-046", "ST02-002", "ST02-006"],
      activeDon: 1,
      deck: ["ST02-012", "ST01-011", "ST01-006"],
    });
    const oldDeck = e.getState().players.south.deck.slice(),
      a = e.findCardInZone("south", "hand", "ST02-002"),
      b = e.findCardInZone("south", "hand", "ST02-006");
    e.asSouth().play("P-046");
    e.asSouth().acceptOptional();
    const step = e.pendingDecision("effectReturnToDeckOwnerOrder", "south").steps[0];
    if (step?.kind !== "orderItems") throw Error("order");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([a, b]);
    expect(
      e.getView("north").decisions.some((d) => d.steps.some((s) => s.kind === "orderItems")),
    ).toBe(false);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.asSouth().orderCards("effectReturnToDeckOwnerOrder", [b, a]);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(
      oldDeck.slice(0, 2),
    );
    expect(e.getState().players.south.deck).toEqual([oldDeck[2], b, a]);
  });
  test("decline leaves every hand and deck identity unchanged", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-046", "ST02-002"], activeDon: 1 });
    const deck = e.getState().players.south.deck.slice(),
      id = e.findCardInZone("south", "hand", "ST02-002");
    e.asSouth().play("P-046");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([id]);
    expect(e.getState().players.south.deck).toEqual(deck);
  });
  test("empty remaining hand draws zero", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-046"], activeDon: 1 });
    e.asSouth().play("P-046");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
  test("single-card hand return precedes draw with one old deck card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-046", "ST02-002"],
      activeDon: 1,
      deck: ["ST02-006"],
    });
    const returned = e.findCardInZone("south", "hand", "ST02-002"),
      drawn = e.findCardInZone("south", "deck", "ST02-006");
    e.asSouth().play("P-046");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([drawn]);
    expect(e.getState().players.south.deck).toEqual([returned]);
    expect(e.getView("south").status).toBe("active");
  });
});
