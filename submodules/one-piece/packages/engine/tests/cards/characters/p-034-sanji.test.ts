import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-034-sanji", () => {
  test("Life2 plus attachedDON grants2000 only own turn", () => {
    const e = OnePieceTestEngine.create({ character: ["P-034"], life: 2, activeDon: 1 });
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    e.attachDon(e.findCardInZone("south", "character", "P-034"), 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
  test("Life3 excludes bonus even with DON", () => {
    const e = OnePieceTestEngine.create({ character: ["P-034"], life: 3, activeDon: 1 });
    e.attachDon(e.findCardInZone("south", "character", "P-034"), 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.lifeCount).toBe(3);
  });
});
