import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P001 Luffy", () => {
  test("played Character cannot attack with one DON but gains Rush at two", () => {
    let e = OnePieceTestEngine.create({ hand: ["P-001"], activeDon: 8 });
    e.asSouth().play("P-001");
    const id = e.findCardInZone("south", "character", "P-001");
    e.asSouth().attachDon(id, 1);
    const f = e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: id,
      targetId: e.leader("north"),
    });
    e = OnePieceTestEngine.fromState(f.state);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    e.asSouth().attachDon(id, 1);
    e.asSouth().attack(id, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(9000);
  });
});
