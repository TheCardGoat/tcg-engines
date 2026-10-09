import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { op02Minotaur087 } from "@tcg/op-cards";
describe("ST09-001 Yamato", () => {
  test("one attached DON and low Life boost only during opponent turn", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST09-001", activeDon: 1, life: 2 });
    e.asSouth().attachDon(e.leader("south"), 1);
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
  });
  test("three Life gives no opponent-turn bonus but Double Attack finishes its second damage after reaching two Life", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST09-001", activeDon: 1, life: 3 },
      { character: [{ card: op02Minotaur087, playedOnTurn: 0 }], activeDon: 1 },
    );
    e.asSouth().attachDon(e.leader("south"), 1);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    const attacker = e.findCardInZone("north", "character", "OP02-087");
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
    e.asNorth().attack(attacker, e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.hand).toHaveLength(2);
    expect(e.getView("south").players.south.leader.power).toBe(6000);
  });
  test("low Life without attached DON remains 5000 on opponent turn", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST09-001", life: 2 });
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
  });
});
