import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("P093 Law", () => {
  test.each([3, 4, 5])("OnPlay compares all field DON against opponent%s", (opponent) => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-093"], activeDon: 4, donDeckCount: 6 },
      { character: [{ cardId: "ST02-012", attachedDon: 2 }], restedDon: opponent - 2 },
    );
    e.asSouth().play("P-093");
    if (opponent >= 4) e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(opponent >= 4 ? 5 : 4);
  });
  test("declines optional DON addition at equality", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-093"], activeDon: 4 }, { activeDon: 4 });
    e.asSouth().play("P-093");
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
  test("Blocker intercepts attack and preserves Life", () => {
    const e = OnePieceTestEngine.create({}, { character: ["P-093"], life: 3 });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(e.findCardInZone("north", "character", "P-093"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
  });
  test("declines optional Blocker", () => {
    const e = OnePieceTestEngine.create({}, { character: ["P-093"], life: 3 });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
});
