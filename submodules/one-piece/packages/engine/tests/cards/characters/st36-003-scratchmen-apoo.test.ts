import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st36-003-scratchmen-apoo", () => {
  test("Life Trigger draws then sets Supernovas Leader base7000 until turn end", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", life: ["ST36-003"], deck: ["ST21-005", "ST21-006"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("wrong Leader still draws but receives no base-power setting", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST05-001", life: ["ST36-003"], deck: ["ST21-005", "ST21-006"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("base-power setting retains a separate battle bonus during Double Attack", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST02-001",
        life: ["ST36-003", "ST29-015"],
        hand: ["ST29-015"],
        activeDon: 1,
        deck: ["ST21-005", "ST21-006", "ST21-008"],
      },
      { character: [{ cardId: "ST22-003", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST22-003"), e.leader("south"));
    e.asSouth().chooseCounter("ST29-015");
    e.asSouth().chooseTargets(e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.leader.power).toBe(9000);
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
