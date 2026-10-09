import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-037-monkey-d-luffy", () => {
  test("attacker counts itself as second rested Character and buff expires", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "P-037", playedOnTurn: 0 },
          { cardId: "P-012", rested: true },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-037", e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
  test("active companion does not count toward two rested Characters", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-037", playedOnTurn: 0 }, "P-012"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-037", e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    expect(e.getView("south").players.south.characters[1]?.rested).toBe(false);
  });
});
