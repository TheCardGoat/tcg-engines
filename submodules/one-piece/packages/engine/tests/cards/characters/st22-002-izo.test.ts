import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-002 Izo", () => {
  test.each([true, false])(
    "search includes compound Whitebeard types and excludes every Izo, choose=%s",
    (take) => {
      const e = OnePieceTestEngine.create({
        hand: ["ST22-002"],
        activeDon: 1,
        deck: ["OP01-033", "ST22-002", "EB01-005", "ST02-002", "ST22-009", "ST02-006"],
      });
      const target = e.findCardInZone("south", "deck", "EB01-005");
      e.asSouth().play("ST22-002");
      const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("search");
      expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([
        target,
        e.findCardInZone("south", "deck", "ST22-009"),
      ]);
      e.resolveDecision("effectSearchSelection", { selectedIds: take ? [target] : [] }, "south");
      const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
      if (order?.kind !== "orderItems") throw Error("order");
      const ids = order.candidates.map((x) => x.ref.id).reverse();
      e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
      expect(e.getState().players.south.deck.slice(-ids.length)).toEqual(ids);
      expect(e.getView("south").players.south.handCount).toBe(take ? 1 : 0);
    },
  );
  test("opponent attack self-trash draws before bottoming a chosen hand card", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST22-002"], hand: ["ST02-002"], deck: ["EB01-005", "ST02-012"] },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const izo = e.findCardInZone("south", "character", "ST22-002"),
      put = e.findCardInZone("south", "hand", "ST02-002");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.handCount).toBe(2);
    e.asSouth().chooseTargets(put);
    expect(e.getState().players.south.deck.at(-1)).toBe(put);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(izo);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["EB01-005"]);
  });
  test("declines optional self-trash", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST22-002"], deck: 10 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
  test("own attack does not offer self-trash", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST22-002", { cardId: "ST02-006", playedOnTurn: 0 }], deck: 10 },
      {},
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"));
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
