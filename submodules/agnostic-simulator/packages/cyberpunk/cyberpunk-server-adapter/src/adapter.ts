import { structuredCards as cyberpunkStructuredCards } from "@tcg/cyberpunk-cards";
import {
  validateCyberpunkDeck,
  type CyberpunkDeckValidationEntry,
} from "@tcg/shared/cyberpunk/deck-validation";
import type {
  CardSummary,
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import {
  cyberpunkCreateServerEngine,
  cyberpunkExtractCardsMapsFromSnapshot,
  cyberpunkRestoreEngine,
  cyberpunkSerializeEngine,
} from "./cyberpunk-engine-lifecycle";
import { CYBERPUNK_RUNTIME_FINGERPRINT } from "./runtime-fingerprint";

/**
 * Server-side {@link GameAdapter} for Cyberpunk. Implements the same
 * contract as the Lorcana adapter so the play module never needs to know
 * which engine it's hosting.
 *
 * Format validation is intentionally minimal — Cyberpunk only ships an
 * "alpha" format today; bring real format checks online when the card pool
 * stabilises.
 */
export const cyberpunkServerAdapter: GameAdapter = {
  slug: "cyberpunk",

  createGameId(): string {
    return `cyberpunk-game-${crypto.randomUUID()}`;
  },

  generateUserName(gameProfileId: string): string {
    // Deterministic short suffix so practice/offline names are stable.
    return `cyber-${gameProfileId.slice(0, 6)}`;
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    for (const { owner, deck } of decks) {
      const ownerInstances: string[] = [];
      // Use a per-owner monotonic counter so duplicate cardId rows in the
      // same DeckBuildInput don't collide on `${owner}-${cardId}-${i}` and
      // overwrite earlier instances in `cardInstances`.
      let counter = 0;
      for (const entry of deck) {
        for (let i = 0; i < entry.qty; i++) {
          const instanceId = `${owner}-${entry.cardId}-${counter++}`;
          cardInstances[instanceId] = entry.cardId;
          ownerInstances.push(instanceId);
        }
      }
      owners[owner] = ownerInstances;
    }
    return { cardInstances, owners };
  },

  getCardById(publicId: string): CardSummary | null {
    const card = cyberpunkStructuredCards.find((candidate) => candidate.id === publicId);
    if (!card) return null;
    return {
      publicId,
      // Cyberpunk's "color" is a single string; expose as a one-element array
      // to match the cross-game CardSummary contract.
      colors: card.color ? [card.color] : [],
    };
  },

  getRuntimeFingerprint() {
    return CYBERPUNK_RUNTIME_FINGERPRINT;
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (formatId !== "alpha") {
      throw new Error(`Unknown Cyberpunk format: ${formatId}`);
    }

    const cardsById = new Map(cyberpunkStructuredCards.map((card) => [card.id, card]));
    const unknownEntries = deck.filter((entry) => !cardsById.has(entry.cardId));
    const totalCount = deck.reduce((sum, entry) => sum + entry.quantity, 0);
    const legends: CyberpunkDeckValidationEntry[] = [];
    const mainDeck: CyberpunkDeckValidationEntry[] = [];

    for (const entry of deck) {
      const card = cardsById.get(entry.cardId);
      if (!card) continue;
      const validationEntry = {
        card: {
          id: card.id,
          name: card.name,
          displayName: card.displayName,
          type: card.type,
          color: card.color,
          ram: card.ram,
        },
        quantity: entry.quantity,
      };
      if (card.type === "legend") {
        legends.push(validationEntry);
      } else {
        mainDeck.push(validationEntry);
      }
    }

    const deckValidation = validateCyberpunkDeck({ legends, mainDeck });
    const rules = [
      {
        kind: "card-pool",
        passed: unknownEntries.length === 0,
        message:
          unknownEntries.length === 0
            ? "All cards are part of the Cyberpunk Alpha pool"
            : `Unknown cards: ${unknownEntries.map((e) => e.cardId).join(", ")}`,
      },
      ...deckValidation.issues.map((issue) => ({
        kind: issue.code,
        passed: false,
        message: issue.message,
      })),
      {
        kind: "deck-size",
        passed: totalCount > 0,
        message:
          totalCount > 0 ? `Deck has ${totalCount} cards` : "Deck must contain at least 1 card",
      },
    ];

    return {
      formatId,
      label: "Alpha",
      valid: unknownEntries.length === 0 && totalCount > 0 && deckValidation.isValid,
      rules,
    };
  },

  createServerEngine: cyberpunkCreateServerEngine,
  serializeEngine: cyberpunkSerializeEngine,
  restoreEngine: cyberpunkRestoreEngine,
  extractCardsMapsFromSnapshot: cyberpunkExtractCardsMapsFromSnapshot,
};
