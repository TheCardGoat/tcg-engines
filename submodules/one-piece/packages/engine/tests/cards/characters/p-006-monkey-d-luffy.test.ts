import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P006 Luffy", () => {
  test("two attached DON grant extra2000 only on own turn", () => {
    const e = OnePieceTestEngine.create({ character: ["P-006"], activeDon: 2 });
    const id = e.findCardInZone("south", "character", "P-006");
    e.asSouth().attachDon(id, 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    e.asSouth().attachDon(id, 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    e.asSouth().attack(id, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
  });
});
