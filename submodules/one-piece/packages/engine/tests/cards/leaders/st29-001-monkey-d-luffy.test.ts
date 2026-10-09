import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-001 Luffy", () => {
  test.each([1, 2, 3])("attack draws and trashes only at Life<=2: %s", (life) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST29-001", life, hand: ["ST02-002"], deck: 10 },
      { life: 4 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const old = e.findCardInZone("south", "hand", "ST02-002");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    if (life <= 2) {
      expect(e.getView("south").players.south.handCount).toBe(2);
      e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [old] }, "south");
    }
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(life <= 2 ? 9 : 10);
    expect(
      e
        .getView("south")
        .players.south.trash.map((c) => c.instanceId)
        .includes(old),
    ).toBe(life <= 2);
  });
  test("Character attacks do not activate Leader draw", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST29-001", life: 2, character: ["ST29-010"], deck: 10 },
      {},
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST29-010"), e.leader("north"));
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
});
