import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-116 Nico Robin", () => {
  test.each([5, 6])(
    "counts its own KO in the seven-trash gate from %s original cards",
    (trashCount) => {
      const e = OnePieceTestEngine.create(
        {
          character: ["P-116"],
          trash: Array(trashCount).fill("EB01-005"),
          deck: ["ST02-002", "ST02-006", "EB01-005"],
        },
        { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const robin = e.findCardInZone("south", "character", "P-116");
      const life = e.getView("south").players.south.lifeCount;
      e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
      e.resolveDecision("battleBlocker", { selectedIds: [robin] }, "south");
      expect(e.getView("south").players.south.lifeCount).toBe(life);
      if (trashCount === 6) {
        expect(e.getView("south").players.south.deckCount).toBe(2);
        expect(e.getView("south").players.south.trash).toHaveLength(8);
      } else {
        expect(e.getView("south").players.south.deckCount).toBe(3);
        expect(e.getView("south").players.south.trash).toHaveLength(6);
      }
    },
  );
});
