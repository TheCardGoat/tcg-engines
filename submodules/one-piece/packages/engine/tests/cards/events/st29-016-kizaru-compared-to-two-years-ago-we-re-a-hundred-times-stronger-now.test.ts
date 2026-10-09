import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

test("Main makes the named Luffy Leader unblockable only for this turn", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST29-016"], activeDon: 1 },
    { character: ["ST01-006"] },
  );
  e.asSouth().play("ST29-016");
  e.asSouth().attack(e.leader("south"), e.leader("north"));
  expect(e.getView("north").players.north.lifeCount).toBe(3);
  expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  e.asSouth().endTurn();
  e.asNorth().endTurn();
  e.asSouth().attack(e.leader("south"), e.leader("north"));
  e.asNorth().chooseBlocker(e.findCardInZone("north", "character", "ST01-006"));
  expect(e.getView("north").players.north.lifeCount).toBe(3);
  expect(e.getView("north").players.north.trash.some((c) => c.cardId === "ST01-006")).toBe(true);
});

test("Main does not make a differently named Leader unblockable", () => {
  const e = OnePieceTestEngine.create(
    { leaderCardId: "ST02-001", hand: ["ST29-016"], activeDon: 1 },
    { character: ["ST01-006"] },
  );
  e.asSouth().play("ST29-016");
  e.asSouth().attack(e.leader("south"), e.leader("north"));
  e.asNorth().chooseBlocker(e.findCardInZone("north", "character", "ST01-006"));
  expect(e.getView("north").players.north.lifeCount).toBe(4);
});

test("Counter protects any Leader for this battle without the Main name restriction", () => {
  const e = OnePieceTestEngine.create(
    { leaderCardId: "ST02-001", hand: ["ST29-016"], activeDon: 1 },
    { character: ["ST02-013"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), e.leader("south"));
  e.asSouth().chooseCounter("ST29-016");
  expect(e.getView("south").players.south.lifeCount).toBe(5);
  expect(e.getView("south").players.south.leader.power).toBe(5000);
});

test("declines the optional Counter Event while it is playable", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST29-016"], activeDon: 1 },
    {},
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.leader("north"), e.leader("south"));
  e.asSouth().chooseCounter();
  expect(e.getView("south").players.south.lifeCount).toBe(3);
  expect(e.getView("south").players.south.hand.some((c) => c.cardId === "ST29-016")).toBe(true);
  expect(e.getView("south").players.south.activeDon).toBe(1);
});
