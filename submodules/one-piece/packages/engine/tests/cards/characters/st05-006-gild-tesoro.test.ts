import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st05GildTesoro006 } from "@tcg/op-cards";
describe("ST05-006 Gild Tesoro", () => {
  test("pays two DON When Attacking to draw two cards", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st05GildTesoro006, playedOnTurn: 0 }],
        activeDon: 2,
        restedDon: 1,
        deck: 10,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const deck = e.getView("south").players.south.deckCount;
    e.asSouth().attack(e.findCardInZone("south", "character", "ST05-006"), e.leader("north"));

    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1"] },
      "south",
    );

    expect(e.getView("south").players.south.hand).toHaveLength(2);
    expect(e.getView("south").players.south.deckCount).toBe(deck - 2);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("declines attack payment and retains DON without drawing", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st05GildTesoro006, playedOnTurn: 0 }],
        activeDon: 2,
        restedDon: 1,
        deck: 10,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const deck = e.getView("south").players.south.deckCount;
    e.asSouth().attack(e.findCardInZone("south", "character", "ST05-006"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(deck - 0);
    expect(e.getView("south").players.south.activeDon).toBe(2);
  });
});
