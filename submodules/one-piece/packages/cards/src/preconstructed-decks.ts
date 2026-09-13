export interface OnePiecePreconstructedDeckEntry {
  readonly cardId: string;
  readonly quantity: number;
}

export interface OnePiecePreconstructedDeck {
  readonly code: string;
  readonly name: string;
  readonly leaderCardId: string;
  readonly colors: readonly string[];
  readonly sourceUrl: string;
  readonly mainDeck: readonly OnePiecePreconstructedDeckEntry[];
}

/**
 * Exact starter lists that are safe to share between practice fixtures and the
 * player-facing deck builder. Add a product only after its quantities have
 * been verified; a product-code card pool is not an exact preconstructed deck.
 */
export const ONE_PIECE_PRECONSTRUCTED_DECKS = [
  {
    code: "ST01",
    name: "Starter Deck: Straw Hat Crew",
    leaderCardId: "ST01-001",
    colors: ["Red"],
    sourceUrl: "https://en.onepiece-cardgame.com/products/decks/st01.php",
    mainDeck: [
      { cardId: "ST01-002", quantity: 4 },
      { cardId: "ST01-003", quantity: 4 },
      { cardId: "ST01-004", quantity: 4 },
      { cardId: "ST01-005", quantity: 4 },
      { cardId: "ST01-006", quantity: 4 },
      { cardId: "ST01-007", quantity: 4 },
      { cardId: "ST01-008", quantity: 4 },
      { cardId: "ST01-009", quantity: 4 },
      { cardId: "ST01-010", quantity: 4 },
      { cardId: "ST01-011", quantity: 2 },
      { cardId: "ST01-012", quantity: 2 },
      { cardId: "ST01-013", quantity: 2 },
      { cardId: "ST01-014", quantity: 2 },
      { cardId: "ST01-015", quantity: 2 },
      { cardId: "ST01-016", quantity: 2 },
      { cardId: "ST01-017", quantity: 2 },
    ],
  },
] as const satisfies readonly OnePiecePreconstructedDeck[];
