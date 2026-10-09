import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-009 Vista", () => {
  test("Blocker intercepts and is KO while Life stays intact", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST22-009"], life: 2 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const v = e.findCardInZone("south", "character", "ST22-009");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseBlocker(v);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(v);
  });
  test("declines Blocker and remains active while Leader takes damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST22-009"], life: 2 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
