import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P026 Morgan", () => {
  test("attack lowers selected opponent cost by3 only this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-026"] },
      { character: ["ST29-003", "ST29-002"] },
    );
    const target = e.findCardInZone("north", "character", "ST29-003");
    e.asSouth().attack(e.findCardInZone("south", "character", "P-026"), e.leader("north"));
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(1);
    expect(e.getView("north").players.north.characters[1]?.cost).toBe(3);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(4);
  });
  test("declines optional cost-reduction target", () => {
    const e = OnePieceTestEngine.create({ character: ["P-026"] }, { character: ["ST29-003"] });
    e.asSouth().attack(e.findCardInZone("south", "character", "P-026"), e.leader("north"));
    e.asSouth().chooseTargets();
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(4);
  });
});
