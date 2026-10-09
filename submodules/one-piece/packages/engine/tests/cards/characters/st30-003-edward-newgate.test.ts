import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-003-edward-newgate", () => {
  test("own-turn aura uses base6000 despite attached DON and excludes boosted5000", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          "ST30-003",
          { cardId: "ST30-005", attachedDon: 1 },
          { cardId: "ST21-006", attachedDon: 1 },
        ],
      },
      {},
    );
    expect(
      e
        .getView("south")
        .players.south.characters.map((c) => c?.power)
        .slice(0, 3),
    ).toEqual([7000, 8000, 6000]);
    e.asSouth().endTurn();
    expect(
      e
        .getView("south")
        .players.south.characters.map((c) => c?.power)
        .slice(0, 3),
    ).toEqual([6000, 6000, 5000]);
  });
  test("a base6000 attacker gains enough power to beat7000", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-003", { cardId: "ST30-005", playedOnTurn: 0 }] },
      { character: [{ cardId: "ST28-004", rested: true }] },
    );
    e.asSouth().attack(
      e.findCardInZone("south", "character", "ST30-005"),
      e.findCardInZone("north", "character", "ST28-004"),
    );
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST28-004");
  });
});
