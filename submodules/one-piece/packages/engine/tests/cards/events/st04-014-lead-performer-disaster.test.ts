import { eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe('ST04-014 Lead Performer "Disaster"', () => {
  test.each([0, 1])("Main must draw before optional DON amount %s", (amount) => {
    const e = OnePieceTestEngine.create({ hand: ["ST04-014"], activeDon: 4, deck: 10 });
    const deck = e.getView("south").players.south.deckCount;
    e.asSouth().play("ST04-014");
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    e.asSouth().chooseAddDon(amount);
    expect(e.getView("south").players.south.activeDon).toBe(amount);
    expect(e.getView("south").players.south.deckCount).toBe(deck - 1);
  });
  test("Life Trigger draws and adds active DON without paying Event cost", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST04-014"], deck: 10 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const deck = e.getView("south").players.south.deckCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseAddDon(1);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.deckCount).toBe(deck - 1);
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
  test("empty DON deck still draws", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST04-014"],
      activeDon: 4,
      donDeckCount: 0,
      deck: 10,
    });
    e.asSouth().play("ST04-014");
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
