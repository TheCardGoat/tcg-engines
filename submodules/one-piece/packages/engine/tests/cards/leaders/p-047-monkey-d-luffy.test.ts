import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-047-monkey-d-luffy", () => {
  test.each([
    [1, 3, 4],
    [1, 4, 4],
    [0, 3, 3],
  ])("DON%s hand%s resolves to%s", (don, hand, result) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-047", activeDon: 1, hand },
      { leaderCardId: "ST01-001" },
    );
    if (don) e.asSouth().attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").players.south.handCount).toBe(result);
    expect(e.getView("south").players.south.deckCount).toBe(don && hand === 3 ? 9 : 10);
  });
  test("DON on another card does not enable Leader draw", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-047", activeDon: 1, hand: 3, character: ["ST02-002"] },
      { leaderCardId: "ST01-001" },
    );
    e.asSouth().attachDon(e.findCardInZone("south", "character", "ST02-002"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").players.south.handCount).toBe(3);
    expect(e.getView("north").players.north.lifeCount).toBe(4);
  });
});
