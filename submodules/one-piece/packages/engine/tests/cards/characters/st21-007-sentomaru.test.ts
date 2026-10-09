import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-007 Sentomaru", () => {
  test("Blocker intercepts Leader damage and is KO'd", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST21-007"], life: 2 },
      { character: [{ cardId: "ST21-014", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST21-014"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST21-007"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST21-007");
  });
  test("declines optional Blocker and leaves Sentomaru active", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST21-007"], life: 2 },
      { character: [{ cardId: "ST21-014", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST21-014"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
