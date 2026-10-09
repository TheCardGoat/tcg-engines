import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P100 Teach", () => {
  test("attack negates opposing Leader aura and Character Blocker until turn ends, preserving own effects", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-100", "ST01-006"] },
      { leaderCardId: "ST30-001", character: ["ST30-007", "ST01-006"], life: 4 },
    );
    expect(e.getView("north").players.north.characters[0]?.power).toBe(9000);
    e.asSouth().attack(e.findCardInZone("south", "character", "P-100"), e.leader("north"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(false);
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST01-006"));
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    e.asNorth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(9000);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(e.findCardInZone("north", "character", "ST01-006"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
});
