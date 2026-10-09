import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-032-sengoku", () => {
  test("attached DON reduces all opposing costs only during own turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-032"], activeDon: 1 },
      { character: ["P-012", "P-015"] },
    );
    expect(
      e
        .getView("north")
        .players.north.characters.map((c) => c?.cost)
        .slice(0, 2),
    ).toEqual([3, 1]);
    e.attachDon(e.findCardInZone("south", "character", "P-032"), 1);
    expect(
      e
        .getView("north")
        .players.north.characters.map((c) => c?.cost)
        .slice(0, 2),
    ).toEqual([1, 0]);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(5);
    e.asSouth().endTurn();
    expect(
      e
        .getView("north")
        .players.north.characters.map((c) => c?.cost)
        .slice(0, 2),
    ).toEqual([3, 1]);
  });
});
