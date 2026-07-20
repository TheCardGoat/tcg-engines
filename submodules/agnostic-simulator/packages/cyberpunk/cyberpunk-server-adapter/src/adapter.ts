import {
  getCyberpunkCanonicalForCardId,
  getMergedCyberpunkCards,
  structuredCards as cyberpunkStructuredCards,
} from "@tcg/cyberpunk-cards";
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
  buildColorMetadataFacets,
  normalizeMetadataColors,
  sortMetadataFacets,
} from "@tcg/shared/game-adapter";
import {
  cyberpunkCreateServerEngine,
  cyberpunkExtractCardsMapsFromSnapshot,
  cyberpunkRestoreEngine,
  cyberpunkSerializeEngine,
} from "./cyberpunk-engine-lifecycle";
import { CYBERPUNK_RUNTIME_FINGERPRINT } from "./runtime-fingerprint";

const cyberpunkCardsByPublicId = new Map(cyberpunkStructuredCards.map((card) => [card.id, card]));
for (const card of getMergedCyberpunkCards()) {
  cyberpunkCardsByPublicId.set(card.canonicalId, card);
}

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
    const card = cyberpunkCardsByPublicId.get(publicId);
    if (!card) return null;
    return {
      publicId,
      // Cyberpunk's "color" is a single string; expose as a one-element array
      // to match the cross-game CardSummary contract.
      colors: card.color ? [card.color] : [],
      label: card.displayName,
      imageUrl: card.imageUrl,
    };
  },

  /**
   * Resolve any Cyberpunk runtime public id (per-set/spoiler id, printing id
   * that merged onto a retail canonical) to the merged canonical id. The
   * atelier helper already applies the slug-merge canonicalization; returns
   * null for truly-unknown ids so callers fall back to the raw publicId.
   */
  getCanonicalCardId(publicId: string): string | null {
    return getCyberpunkCanonicalForCardId(publicId);
  },

  getRuntimeFingerprint() {
    return CYBERPUNK_RUNTIME_FINGERPRINT;
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (formatId !== "alpha") {
      throw new Error(`Unknown Cyberpunk format: ${formatId}`);
    }

    // Deck identity v2+ projects Cyberpunk cards to their stable canonical
    // slug. The raw runtime catalog remains keyed by per-printing UUIDs, so
    // validate against both shapes. The merged view supplies the authoritative
    // card data for canonical ids, while the raw view keeps legacy UUID decks
    // playable during the migration.
    const unknownEntries = deck.filter((entry) => !cyberpunkCardsByPublicId.has(entry.cardId));
    const totalCount = deck.reduce((sum, entry) => sum + entry.quantity, 0);
    const legends: CyberpunkDeckValidationEntry[] = [];
    const mainDeck: CyberpunkDeckValidationEntry[] = [];

    for (const entry of deck) {
      const card = cyberpunkCardsByPublicId.get(entry.cardId);
      if (!card) continue;
      const validationEntry = {
        card: {
          id: entry.cardId,
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
        details:
          unknownEntries.length === 0
            ? undefined
            : { cardIds: unknownEntries.map((entry) => entry.cardId) },
      },
      ...deckValidation.issues.map((issue) => ({
        kind: issue.code,
        passed: false,
        message: issue.message,
        details: {
          ...(issue.cardId ? { cardId: issue.cardId } : {}),
          ...(issue.cardName ? { cardName: issue.cardName } : {}),
          ...(issue.color ? { color: issue.color } : {}),
        },
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

  metadata: {
    projectionVersion: 1,
    capabilities: { colors: true, deckLists: true, archetypes: true },
    facets: [
      {
        type: "legend-lineup",
        label: "Legend lineup",
        pluralLabel: "Legend lineups",
        kind: "combination",
        order: 10,
      },
      { type: "legend", label: "Legend", pluralLabel: "Legends", kind: "individual", order: 20 },
      { type: "color", label: "Color", pluralLabel: "Colors", kind: "individual", order: 30 },
      {
        type: "color-combination",
        label: "Color combination",
        pluralLabel: "Color combinations",
        kind: "combination",
        order: 40,
      },
    ],
    projectDeck(deck) {
      const members = deck
        .flatMap((entry) => {
          const card = cyberpunkCardsByPublicId.get(entry.cardId);
          if (!card || card.type !== "legend") return [];
          const cardId = getCyberpunkCanonicalForCardId(entry.cardId) ?? entry.cardId;
          return Array.from({ length: Math.max(0, Math.floor(entry.quantity)) }, () => ({
            cardId,
            label: card.displayName,
            colors: card.color ? [card.color] : [],
            imageUrl: card.imageUrl,
            attributes: { ram: card.ram ?? 0 },
          }));
        })
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
      const colors = normalizeMetadataColors(members.flatMap((member) => member.colors));
      const individualLegends = [
        ...new Map(members.map((member) => [member.cardId, member])).values(),
      ];
      const lineup =
        members.length === 0
          ? []
          : [
              {
                type: "legend-lineup",
                key: members.map((member) => member.cardId).join("+"),
                label: members.map((member) => member.label).join(" / "),
                colors,
                members,
              },
            ];
      return {
        schemaVersion: 1,
        projectionVersion: 1,
        game: "cyberpunk",
        cardCount: deck.reduce((sum, entry) => sum + Math.max(0, Math.floor(entry.quantity)), 0),
        colors,
        facets: sortMetadataFacets([
          ...lineup,
          ...individualLegends.map((member) => ({
            type: "legend",
            key: member.cardId,
            label: member.label,
            colors: member.colors,
            members: [member],
          })),
          ...buildColorMetadataFacets(colors),
        ]),
      };
    },
    normalizeTemplate(deck) {
      return deck
        .flatMap((entry) => {
          const card = cyberpunkCardsByPublicId.get(entry.cardId);
          if (!card) return [];
          if (card.type === "legend") return [{ ...entry, quantity: 1 }];
          if (entry.quantity >= 4) return [{ ...entry, quantity: 4 }];
          if (entry.quantity >= 2) return [{ ...entry, quantity: 2 }];
          return [];
        })
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
    normalizeSynergy(deck) {
      return deck
        .filter((entry) => {
          const card = cyberpunkCardsByPublicId.get(entry.cardId);
          return card?.type !== "legend" && entry.quantity > 1;
        })
        .map((entry) => ({ ...entry, quantity: 1 }))
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
  },

  createServerEngine: cyberpunkCreateServerEngine,
  serializeEngine: cyberpunkSerializeEngine,
  restoreEngine: cyberpunkRestoreEngine,
  extractCardsMapsFromSnapshot: cyberpunkExtractCardsMapsFromSnapshot,
};
