import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st24-002-kid-killer", () => {
  test("search adds Supernovas and lets owner order remaining physical cards", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST24-002"],
      activeDon: 2,
      deck: ["ST24-005", "ST21-005", "ST21-006", "ST21-008", "ST21-013", "ST21-002"],
    });
    const wanted = e.findCardInZone("south", "deck", "ST24-005");
    e.playCard("ST24-002");
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("search");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([wanted]);
    e.asSouth().chooseSearch(wanted);
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    const ids = order.candidates.map((c) => c.ref.id).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    expect(e.getView("south").players.south.hand[0]?.instanceId).toBe(wanted);
    /* Hidden deck order is not exposed in player view. */ expect(
      e.getState().players.south.deck.slice(-4),
    ).toEqual(ids);
  });
  test("opponent attack can pay self-trash to ready a rested DON", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST24-002"], restedDon: 1 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST24-002");
  });
  test("declines optional self-trash during opponent attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST24-002"], restedDon: 1 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST24-002");
  });
  test("declines optional search and orders all five remaining cards", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST24-002"],
      activeDon: 2,
      deck: ["ST24-005", "ST21-005", "ST21-006", "ST21-008", "ST21-013", "ST21-002"],
    });
    e.playCard("ST24-002");
    e.asSouth().chooseNoSearch();
    const p = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    e.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: p.candidates.map((c) => c.ref.id) },
      "south",
    );
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(6);
  });
});
