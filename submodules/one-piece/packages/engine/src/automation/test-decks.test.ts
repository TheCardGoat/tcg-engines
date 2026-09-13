import { describe, expect, test } from "vite-plus/test";
// Deck-construction validation ("standard" format) is owned by the game
// workspace: validateDeckForFormat from @tcg/op-cards.
import { getCard, validateDeckForFormat } from "@tcg/op-cards";
import { TEST_DECKS, type TestDeckId } from "./test-decks.ts";

interface DeckEntry {
  cardId: string;
  quantity: number;
}

function toDeckEntries(cardIds: readonly string[]): DeckEntry[] {
  const quantities = new Map<string, number>();
  for (const cardId of cardIds) {
    quantities.set(cardId, (quantities.get(cardId) ?? 0) + 1);
  }
  return [...quantities].map(([cardId, quantity]) => ({ cardId, quantity }));
}

describe("One Piece test decks", () => {
  const deckIds = Object.keys(TEST_DECKS) as TestDeckId[];

  test("covers six distinct archetypes", () => {
    expect(deckIds).toHaveLength(6);
  });

  for (const deckId of deckIds) {
    test(`${deckId} is a legal standard deck`, () => {
      const deck = TEST_DECKS[deckId];

      expect(deck.mainDeck).toHaveLength(50);

      const leader = getCard(deck.leaderId);
      expect(leader.cardType).toBe("leader");

      const copies = new Map<string, number>();
      for (const cardId of deck.mainDeck) {
        const card = getCard(cardId);
        expect(card.cardType).not.toBe("leader");
        expect(card.color.some((color) => leader.color.includes(color))).toBe(true);
        copies.set(card.canonicalId, (copies.get(card.canonicalId) ?? 0) + 1);
      }
      for (const [canonicalId, count] of copies) {
        expect(count, `${canonicalId} exceeds 4 copies`).toBeLessThanOrEqual(4);
      }

      const result = validateDeckForFormat("standard", [
        { cardId: deck.leaderId, quantity: 1 },
        ...toDeckEntries(deck.mainDeck),
      ]);
      expect(
        result.valid,
        `${deckId} failed validation: ${JSON.stringify(result.rules.filter((r) => !r.passed))}`,
      ).toBe(true);
    });
  }
});
