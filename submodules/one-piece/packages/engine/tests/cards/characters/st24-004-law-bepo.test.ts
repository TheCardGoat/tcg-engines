import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st24-004-law-bepo", () => {
  test("rests and freezes the same physical Character then boosts Leader at two rested", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST24-004"], activeDon: 10 },
      { character: ["ST21-005", { cardId: "ST21-006", rested: true }] },
    );
    const selected = e.findCardInZone("north", "character", "ST21-005");
    e.playCard("ST24-004");
    e.asSouth().chooseTargets(selected);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(selected);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(false);
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("one rested opponent does not grant Leader power", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST24-004"], activeDon: 10 },
      { character: ["ST21-005"] },
    );
    e.playCard("ST24-004");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
  });
  test("declines optional rest but two already rested opponents still grant bonus", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST24-004"], activeDon: 10 },
      {
        character: [
          { cardId: "ST21-005", rested: true },
          { cardId: "ST21-006", rested: true },
        ],
      },
    );
    e.playCard("ST24-004");
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters.every((c) => !c || !c.rested)).toBe(true);
  });
});
