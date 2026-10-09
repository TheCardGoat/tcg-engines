import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-145", () => {
  test("On Play draws before its hand discard", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-145", "EB01-018"],
      activeDon: 4,
      deck: ["EB01-005", "EB01-025"],
    });
    const drawn = e.findCardInZone("south", "deck", "EB01-005");
    e.playCard("P-145");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(drawn);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [drawn] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(drawn);
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("EB01-018");
  });
  test.each([5, 6])("On K.O. checks opposing hand boundary %i", (count) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-145", rested: true }] },
      { character: ["OP16-003"], hand: Array.from({ length: count }, () => "EB01-005") },
      { activeSeat: "north" },
    );
    e.asNorth().attack("OP16-003", "P-145");
    if (count === 6) {
      const ids = e
        .getView("north")
        .players.north.hand.slice(0, 2)
        .map((c) => c.instanceId!);
      e.resolveDecision("effectTrashFromHandSelection", { selectedIds: ids }, "north");
      expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toEqual(ids);
    }
    expect(e.getView("north").players.north.hand).toHaveLength(count === 6 ? 4 : 5);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
