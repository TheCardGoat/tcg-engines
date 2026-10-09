import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("P098 Buggy", () => {
  test("counts itself as fifth cost5-or-more Character and can block", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-098"],
      activeDon: 10,
      character: ["P-089", "P-089", "P-089", "P-089"],
    });
    e.asSouth().play("P-098");
    const id = e.findCardInZone("south", "character", "P-098");
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(5);
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(id);
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
  });
  test("five Characters with one belowcost5 bottom-decks only Buggy", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-098"],
      activeDon: 10,
      character: ["P-089", "P-089", "P-089", "ST02-012"],
    });
    const id = e.findCardInZone("south", "hand", "P-098");
    const deck = e.getView("south").players.south.deckCount;
    e.asSouth().play("P-098");
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === id)).toBe(
      false,
    );
    expect(e.getView("south").players.south.deckCount).toBe(deck + 1);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
  test("declines optional Blocker", () => {
    const e = OnePieceTestEngine.create({}, { character: ["P-098"], life: 3 });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
});
