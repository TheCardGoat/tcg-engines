import * as gundamCards from "@tcg/gundam-cards";
import type {
  CardSummary,
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import {
  gundamCreateServerEngine,
  gundamExtractCardsMapsFromSnapshot,
  gundamRestoreEngine,
  gundamSerializeEngine,
} from "./gundam-engine-lifecycle.js";

/**
 * Server-side {@link GameAdapter} for Bandai Gundam Card Game. Mirrors the
 * Lorcana / Cyberpunk shape so the play module stays game-agnostic.
 *
 * Format validation is intentionally minimal — Gundam's competitive formats
 * aren't fully wired into the legality engine here yet; the basic checks
 * (known cards + non-empty deck) keep this adapter functional while we
 * defer real format work to the format-legality follow-up.
 */
export const gundamServerAdapter: GameAdapter = {
  slug: "gundam",

  createGameId(): string {
    return `gundam-game-${crypto.randomUUID()}`;
  },

  generateUserName(gameProfileId: string): string {
    return `pilot-${gameProfileId.slice(0, 6)}`;
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    for (const { owner, deck } of decks) {
      const ownerInstances: string[] = [];
      // Per-owner monotonic counter so duplicate cardId rows in the same
      // DeckBuildInput don't collide on `${owner}-${cardId}-${i}`.
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
    const card = (gundamCards as Record<string, unknown>)[publicId] as
      | { color?: string | string[] }
      | undefined;
    if (!card) {
      // Walk the catalog by id/cardNumber as a fallback for ids that aren't
      // the exported binding name.
      for (const value of Object.values(gundamCards)) {
        if (!value || typeof value !== "object") continue;
        const c = value as { id?: string; cardNumber?: string; color?: string | string[] };
        if (c.id === publicId || c.cardNumber === publicId) {
          return {
            publicId,
            colors: Array.isArray(c.color) ? c.color : c.color ? [c.color] : [],
          };
        }
      }
      return null;
    }
    return {
      publicId,
      colors: Array.isArray(card.color) ? card.color : card.color ? [card.color] : [],
    };
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (formatId !== "standard") {
      throw new Error(`Unknown Gundam format: ${formatId}`);
    }

    const totalCount = deck.reduce((sum, entry) => sum + entry.quantity, 0);

    return {
      formatId,
      label: "Standard",
      valid: totalCount > 0,
      rules: [
        {
          kind: "deck-size",
          passed: totalCount > 0,
          message:
            totalCount > 0 ? `Deck has ${totalCount} cards` : "Deck must contain at least 1 card",
        },
      ],
    };
  },

  createServerEngine: gundamCreateServerEngine,
  serializeEngine: gundamSerializeEngine,
  restoreEngine: gundamRestoreEngine,
  extractCardsMapsFromSnapshot: gundamExtractCardsMapsFromSnapshot,
};
