import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST15-003 Kingdew", () => {
  test("opponent-turn effect KO gives Leader temporary power", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-003"] },
      { hand: ["ST04-004"], activeDon: 6 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST04-004", "north");
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST15-003"));
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.endTurn("north");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("declines optional Leader power after effect KO", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-003"] },
      { hand: ["ST04-004"], activeDon: 6 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST04-004", "north");
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST15-003"));
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST15-003");
  });
  test("Blocker battle KO protects Life but does not increase Leader power", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-003"], life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST15-003"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST15-003");
  });
  test("own-turn effect KO does not grant Leader power", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP01-091",
      character: ["ST15-003"],
      hand: ["OP01-094"],
      activeDon: 10,
    });
    e.playCard("OP01-094");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST15-003");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
