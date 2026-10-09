import { describe, expect, it } from "vite-plus/test";
import { P1 } from "@tcg/cyberpunk-engine";
import type { MoveLogEntry } from "../../engine";
import { soldCardReceipts } from "./soldCards";

function deckSale(
  id: number,
  turnNumber: number,
  cardIds: string[],
  cardNames: string[],
): MoveLogEntry {
  return {
    id,
    side: "player",
    log: {
      type: "action",
      playerId: P1,
      turnNumber,
      timestamp: id,
      messageKey: "effect.sellFromDeck.resolved",
      params: { soldCardIdsList: cardIds, soldCardNamesList: cardNames },
    },
  };
}

describe("V2 public sale receipts", () => {
  it("shows only the current turn's banked sales, so older sales hide again", () => {
    const logs = [
      deckSale(1, 3, ["older"], ["Mox Inciters"]),
      deckSale(2, 4, ["a", "b"], ["Corpo Security", "Corpo Security"]),
      deckSale(3, 4, ["c"], ["Field Operator"]),
    ];

    expect(
      soldCardReceipts(logs, new Set(["older", "a", "b", "c"]), "player", 4).map(
        ({ cardId, cardName }) => [cardId, cardName],
      ),
    ).toEqual([
      ["a", "Corpo Security"],
      ["b", "Corpo Security"],
      ["c", "Field Operator"],
    ]);
    // Back on turn 3 only that turn's sale is revealed.
    expect(
      soldCardReceipts(logs, new Set(["older", "a", "b", "c"]), "player", 3).map(
        ({ cardId }) => cardId,
      ),
    ).toEqual(["older"]);
  });

  it("drops a receipt once the card leaves the Eddies area (undo or removal)", () => {
    const logs = [deckSale(1, 4, ["a", "b"], ["Corpo Security", "Field Operator"])];
    expect(soldCardReceipts(logs, new Set(["a"]), "player", 4).map(({ cardId }) => cardId)).toEqual(
      ["a"],
    );
    expect(soldCardReceipts(logs, new Set(), "player", 4)).toEqual([]);
  });

  it("ignores sales logged by the other side", () => {
    const logs: MoveLogEntry[] = [
      { id: 1, side: "opponent", log: deckSale(1, 4, ["a"], ["Corpo Security"]).log },
    ];
    expect(soldCardReceipts(logs, new Set(["a"]), "player", 4)).toEqual([]);
  });
});
