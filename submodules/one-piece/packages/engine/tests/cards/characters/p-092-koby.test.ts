import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("P092 Koby", () => {
  test("Navy Leader base becomes7000 through opposing turn then expires; Koby loses3000 only opposing turn", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST06-001",
      character: ["P-092"],
      activeDon: 1,
    });
    e.asSouth().attachDon(e.leader("south"), 1);
    const id = e.findCardInZone("south", "character", "P-092");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    e.asSouth().attack(id, e.leader("north"));
    expect(e.getView("south").players.south.leader.power).toBe(8000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
  });
  test("wrong Leader type does not gain base power", () => {
    const e = OnePieceTestEngine.create({ character: ["P-092"] });
    e.asSouth().attack(e.findCardInZone("south", "character", "P-092"), e.leader("north"));
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
