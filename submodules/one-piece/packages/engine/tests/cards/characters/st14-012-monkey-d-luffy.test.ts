import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-012 Monkey.D.Luffy", () => {
  test("self at cost ten gains Rush and can attack on play turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST14-012"], character: ["ST14-004"], activeDon: 8 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST14-012");
    const id = e.findCardInZone("south", "character", "ST14-012");
    e.activateEffect(e.findCardInZone("south", "character", "ST14-004"), "activateMain");
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(10);
    e.asSouth().attack(id, e.leader("north"));
    expect(e.getView("south").players.south.characters[1]?.rested).toBe(true);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
  test("without a cost-ten Character the new Character cannot attack", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST14-012"], activeDon: 8 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST14-012");
    const id = e.findCardInZone("south", "character", "ST14-012");
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: id,
        targetId: e.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
