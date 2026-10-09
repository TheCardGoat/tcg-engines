import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P097 Shanks", () => {
  test("OnPlay prevents opponent Blocker for all our attacks during turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-097"], activeDon: 10 },
      { character: ["ST01-006"], life: 3 },
    );
    e.asSouth().play("P-097");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("WhenAttacking prevents Blocker; restriction expires next turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-097"] },
      { character: ["ST01-006"], life: 4 },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "P-097"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(e.findCardInZone("north", "character", "ST01-006"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("ST01-006");
  });
});
