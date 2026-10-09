import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-004-sanji", () => {
  test("On Play grants Rush at 5000 power and keeps it after that Character leaves", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-004"], activeDon: 6, character: [{ cardId: "ST02-013", playedOnTurn: 0 }] },
      { character: [{ cardId: "ST10-009", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST10-004", "south");
    const sanji = e.findCardInZone("south", "character", "ST10-004"),
      target = e.findCardInZone("north", "character", "ST10-009");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-013"), target, "south");
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(0);
    e.declareAttack(sanji, e.leader("north"), "south");
    expect(e.getView("south").players.north.lifeCount).toBe(3);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === sanji)?.rested,
    ).toBe(true);
  });
  test("On Play without a 5000-power Character does not grant Rush", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-004"], activeDon: 6 },
      { character: ["ST02-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST10-004", "south");
    const id = e.findCardInZone("south", "character", "ST10-004");
    e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: id,
      targetId: e.leader("north"),
    });
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
