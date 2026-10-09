import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P028 Ace", () => {
  test("actual Leader battle deals two Life damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-028"] },
      { life: ["ST02-002", "ST02-006", "ST02-012"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "P-028"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(1);
    expect(e.getView("north").players.north.handCount).toBe(2);
  });
  test("Double Attack does not bypass Rush restriction on played turn", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-028"], activeDon: 5 });
    e.asSouth().play("P-028");
    const f = e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: e.findCardInZone("south", "character", "P-028"),
      targetId: e.leader("north"),
    });
    const restored = OnePieceTestEngine.fromState(f.state);
    expect(restored.getView("north").players.north.lifeCount).toBe(4);
    expect(restored.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
