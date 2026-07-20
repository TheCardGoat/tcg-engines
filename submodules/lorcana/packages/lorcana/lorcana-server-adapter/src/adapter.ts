import { createGameId } from "@tcg/lorcana-engine";
import { generateUserName } from "@tcg/lorcana-types/name-generator";
import { fromDeckToCardInstances } from "@tcg/lorcana-cards";
import { getAllCardsByIdSync } from "@tcg/lorcana-cards/cards/sync";
import {
  LORCANA_FORMATS,
  type LorcanaFormatId,
  type DeckFormatResult as LorcanaDeckFormatResult,
} from "@tcg/lorcana-types";
import type {
  CardSummary,
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import {
  buildColorMetadataFacets,
  normalizeMetadataColors,
  sortMetadataFacets,
} from "@tcg/shared/game-adapter";
import { validateDeckForLorcanaFormat } from "./deck-format-legality";
import {
  lorcanaCreateServerEngine,
  lorcanaExtractCardsMapsFromSnapshot,
  lorcanaRestoreEngine,
  lorcanaSerializeEngine,
} from "./lorcana-engine-lifecycle";

const LORCANA_FORMAT_IDS = new Set<string>(Object.keys(LORCANA_FORMATS));

function isLorcanaFormatId(formatId: string): formatId is LorcanaFormatId {
  return LORCANA_FORMAT_IDS.has(formatId);
}

function getLorcanaCard(publicId: string) {
  const cardsById = getAllCardsByIdSync();
  return (
    cardsById[publicId] ?? Object.values(cardsById).find((card) => card.canonicalId === publicId)
  );
}

export const lorcanaServerAdapter: GameAdapter = {
  slug: "lorcana",

  createGameId(): string {
    return createGameId() as string;
  },

  generateUserName(gameProfileId: string): string {
    return generateUserName(gameProfileId);
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    return fromDeckToCardInstances(
      decks.map((d) => ({
        owner: d.owner,
        deck: d.deck.map((entry) => ({ cardId: entry.cardId, qty: entry.qty })),
      })),
    );
  },

  getCardById(publicId: string): CardSummary | null {
    const card = getLorcanaCard(publicId);
    if (!card) return null;
    return {
      publicId,
      colors: card.inkType ?? [],
      label: card.fullName ?? card.name,
      imageUrl: card.printings[0]?.imageUrl,
    };
  },

  /**
   * Resolves a game-native public id (the Lorcana engine short id, e.g. "0Tb")
   * to the card's canonical id (e.g. "ci_0Tb").
   *
   * Lorcana's `canonicalId` (`ci_*`) is distinct from the engine short id
   * (`id`/publicId) — it is NOT an identity mapping. See RFC §4 Lorcana row,
   * §3 worked-example table (Authored id = short id; Canonical = `ci_*`), and
   * ADR-1 (canonical identity is `canonicalId` on every game card type).
   *
   * Implemented as the analytics canonicalization seam: callers (analytics,
   * meta stats, deck hashing) resolve any short id to its `canonicalId` so
   * every reprint / alt-art of the same card groups under one key. Returns
   * `null` for unknown ids so callers can fall back to the raw publicId
   * (GameAdapter contract; RFC §5 gap 8, ADR-2).
   */
  getCanonicalCardId(publicId: string): string | null {
    const card = getLorcanaCard(publicId);
    return card?.canonicalId ?? null;
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (!isLorcanaFormatId(formatId)) {
      throw new Error(`Unknown Lorcana format: ${formatId}`);
    }
    const result: LorcanaDeckFormatResult = validateDeckForLorcanaFormat(formatId, deck);
    return {
      formatId: result.formatId,
      label: LORCANA_FORMATS[formatId].label,
      valid: result.valid,
      rules: result.rules.map((r) => ({
        kind: String(r.kind),
        passed: r.passed,
        message: r.message,
        details: r.details,
      })),
    };
  },

  metadata: {
    projectionVersion: 1,
    capabilities: { colors: true, deckLists: true, archetypes: true },
    facets: [
      { type: "color", label: "Ink", pluralLabel: "Inks", kind: "individual", order: 10 },
      {
        type: "color-combination",
        label: "Ink combination",
        pluralLabel: "Ink combinations",
        kind: "combination",
        order: 20,
      },
    ],
    projectDeck(deck) {
      const colors = normalizeMetadataColors(
        deck.flatMap((entry) => getLorcanaCard(entry.cardId)?.inkType ?? []),
      );
      return {
        schemaVersion: 1,
        projectionVersion: 1,
        game: "lorcana",
        cardCount: deck.reduce((sum, entry) => sum + Math.max(0, Math.floor(entry.quantity)), 0),
        colors,
        facets: sortMetadataFacets(buildColorMetadataFacets(colors)),
      };
    },
    normalizeTemplate(deck) {
      return deck
        .flatMap((entry) => {
          if (entry.quantity >= 4) return [{ ...entry, quantity: 4 }];
          if (entry.quantity >= 2) return [{ ...entry, quantity: 2 }];
          return [];
        })
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
    normalizeSynergy(deck) {
      return deck
        .filter((entry) => entry.quantity > 1)
        .map((entry) => ({ ...entry, quantity: 1 }))
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
  },

  createServerEngine: lorcanaCreateServerEngine,
  serializeEngine: lorcanaSerializeEngine,
  restoreEngine: lorcanaRestoreEngine,
  extractCardsMapsFromSnapshot: lorcanaExtractCardsMapsFromSnapshot,
};
