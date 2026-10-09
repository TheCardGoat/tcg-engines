import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST31-003 Brook", () => {
  test.each([2, 3])("counts distributed given DON live on opponent turn: %i", (amount) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["ST31-003", "ST02-002"], activeDon: 3 },
      { leaderCardId: "ST01-001" },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const brook = e.findCardInZone("south", "character", "ST31-003"),
      vito = e.findCardInZone("south", "character", "ST02-002");
    e.asSouth().attachDon(e.leader("south"), 1);
    e.asSouth().attachDon(vito, amount - 1);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === brook)?.power,
    ).toBe(3000);
    e.asSouth().endTurn();
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === brook)?.power,
    ).toBe(amount === 3 ? 6000 : 3000);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    if (amount === 3) {
      e.asSouth().chooseBlocker(brook);
      expect(
        e.getView("south").players.south.characters.find((c) => c?.instanceId === brook)?.rested,
      ).toBe(true);
    } else {
      expect(e.getView("south").players.south.lifeCount).toBe(4);
    }
  });
  test("can decline Blocker while its condition is met", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["ST31-003"], activeDon: 3 },
      { leaderCardId: "ST01-001" },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attachDon(e.leader("south"), 3);
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
  test("loses power and Blocker when an attached-DON Character leaves", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["ST31-003", "ST02-002"], activeDon: 3 },
      { leaderCardId: "ST01-001", hand: ["ST01-015"], activeDon: 4 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const brook = e.findCardInZone("south", "character", "ST31-003"),
      vito = e.findCardInZone("south", "character", "ST02-002");
    e.asSouth().attachDon(e.leader("south"), 1);
    e.asSouth().attachDon(vito, 2);
    e.asSouth().endTurn();
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === brook)?.power,
    ).toBe(6000);
    e.asNorth().play("ST01-015");
    e.asNorth().chooseTargets(vito);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === brook)?.power,
    ).toBe(3000);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === brook)?.rested,
    ).toBe(false);
  });
});
