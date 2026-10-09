import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-009 Makino", () => {
  test("draws when its controller has a zero-cost Character on opponent turn", () => {
    const e = OnePieceTestEngine.create(
      {
        life: ["OP03-094"],
        trash: ["ST08-009"],
        character: ["ST08-003"],
        deck: ["ST08-003", "ST08-010"],
      },
      { character: [{ cardId: "OP02-121", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const makino = e.findCardInZone("south", "trash", "ST08-009");
    e.asNorth().attack(e.findCardInZone("north", "character", "OP02-121"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.resolveDecision("effectPlaySelection", { selectedIds: [makino] }, "south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(0);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST08-003"]);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("draws for an opposing zero-cost Character after a public reduction", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-008", "ST08-009"], activeDon: 3, deck: ["ST08-003", "ST08-010"] },
      { character: ["ST08-003"] },
    );
    e.playCard("ST08-008");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST08-003"));
    e.playCard("ST08-009");
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(0);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST08-003"]);
  });
  test("does not draw when every Character costs at least one", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-009"], activeDon: 2 },
      { character: ["ST08-008"] },
    );
    const deck = e.getView("south").players.south.deckCount;
    e.playCard("ST08-009");
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(deck);
  });
});
