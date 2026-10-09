import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST25-002 Cabaji", () => {
  test("two high-base Characters grant Blocker and cost, opponent turn grants power", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST25-002", "ST22-010", "ST22-010"], life: 2 },
      { character: [{ cardId: "ST02-012", playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const c = e.findCardInZone("south", "character", "ST25-002");
    expect(e.getView("south").players.south.characters[0]).toMatchObject({ cost: 5, power: 1000 });
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-012"), e.leader("south"));
    e.asSouth().chooseBlocker(c);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(c);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(1000);
  });
  test("one high-base Character does not grant Blocker but opponent power still applies", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST25-002", "ST22-010"], life: 2 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    expect(e.getView("south").players.south.characters[0]).toMatchObject({ cost: 4, power: 6000 });
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
  test("declines conditional Blocker with valid board", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST25-002", "ST22-010", "ST22-010"], life: 2 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
