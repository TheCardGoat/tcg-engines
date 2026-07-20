import { getAllCards, getCard, hasCard } from "@tcg/op-cards";
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
  onePieceCreateServerEngine,
  onePieceExtractCardsMapsFromSnapshot,
  onePieceRestoreEngine,
  onePieceSerializeEngine,
} from "./one-piece-engine-lifecycle";

const onePieceCanonicalByPublicId: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const card of getAllCards()) {
    map.set(card.id, card.canonicalId);
    for (const printing of card.printings) {
      map.set(printing.id, card.canonicalId);
    }
  }
  return map;
})();

const onePieceCardByAnyId = (() => {
  const map = new Map<string, ReturnType<typeof getCard>>();
  for (const card of getAllCards()) {
    map.set(card.id, card);
    map.set(card.canonicalId, card);
    for (const printing of card.printings) map.set(printing.id, card);
  }
  return map;
})();

export const onePieceServerAdapter: GameAdapter = {
  slug: "one-piece",

  createGameId(): string {
    return `one-piece-game-${crypto.randomUUID()}`;
  },

  generateUserName(gameProfileId: string): string {
    return `pirate-${gameProfileId.slice(0, 6)}`;
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    for (const { owner, deck } of decks) {
      const ownerInstances: string[] = [];
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
    const card = onePieceCardByAnyId.get(publicId);
    return card
      ? {
          publicId,
          colors: card.color,
          label: card.name,
          imageUrl: card.printings[0]?.imageUrl,
        }
      : null;
  },

  getCanonicalCardId(publicId: string): string | null {
    return onePieceCanonicalByPublicId.get(publicId) ?? null;
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (formatId !== "standard") {
      throw new Error(`Unknown One Piece format: ${formatId}`);
    }

    const totalCount = deck.reduce((sum, entry) => sum + entry.quantity, 0);
    const leaderCount = deck.filter((entry) => {
      if (!hasCard(entry.cardId)) return false;
      return getCard(entry.cardId).cardType === "leader";
    }).length;
    const copiesByCanonicalId = new Map<string, number>();
    for (const entry of deck) {
      const canonicalId = onePieceCanonicalByPublicId.get(entry.cardId) ?? entry.cardId;
      copiesByCanonicalId.set(
        canonicalId,
        (copiesByCanonicalId.get(canonicalId) ?? 0) + entry.quantity,
      );
    }
    const overCopyLimit = [...copiesByCanonicalId].filter(([canonicalId, quantity]) => {
      if (quantity <= 4 || !hasCard(canonicalId)) return false;
      return !getCard(canonicalId).effects?.deckBuildingRules?.some(
        (rule) => rule.rule === "unlimitedCopies",
      );
    });
    const copyLimitPassed = overCopyLimit.length === 0;

    return {
      formatId,
      label: "Standard",
      valid: totalCount > 0 && leaderCount === 1 && copyLimitPassed,
      rules: [
        {
          kind: "deck-size",
          passed: totalCount > 0,
          message:
            totalCount > 0 ? `Deck has ${totalCount} cards` : "Deck must contain at least 1 card",
        },
        {
          kind: "leader-count",
          passed: leaderCount === 1,
          message:
            leaderCount === 1
              ? "Deck has exactly 1 leader"
              : `Deck must have exactly 1 leader (found ${leaderCount})`,
        },
        {
          kind: "copy-limit",
          passed: copyLimitPassed,
          message: copyLimitPassed
            ? "No card exceeds its allowed copy limit"
            : `Copy limit exceeded: ${overCopyLimit
                .map(([canonicalId, quantity]) => `${canonicalId} x${quantity}`)
                .join(", ")}`,
          details: overCopyLimit.map(([canonicalId, quantity]) => ({ canonicalId, quantity })),
        },
      ],
    };
  },

  metadata: {
    projectionVersion: 1,
    capabilities: { colors: true, deckLists: true, archetypes: true },
    facets: [
      { type: "leader", label: "Leader", pluralLabel: "Leaders", kind: "identity", order: 10 },
      {
        type: "color",
        label: "Leader color",
        pluralLabel: "Leader colors",
        kind: "individual",
        order: 20,
      },
      {
        type: "color-combination",
        label: "Leader color combination",
        pluralLabel: "Leader color combinations",
        kind: "combination",
        order: 30,
      },
    ],
    projectDeck(deck) {
      const leaders = deck
        .flatMap((entry) => {
          const card = onePieceCardByAnyId.get(entry.cardId);
          if (!card) return [];
          if (card.cardType !== "leader") return [];
          return [
            {
              cardId: card.canonicalId,
              label: card.name,
              colors: [...card.color],
              imageUrl: card.printings[0]?.imageUrl,
            },
          ];
        })
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
      const colors = normalizeMetadataColors(leaders.flatMap((leader) => leader.colors));
      return {
        schemaVersion: 1,
        projectionVersion: 1,
        game: "one-piece",
        cardCount: deck.reduce((sum, entry) => sum + Math.max(0, Math.floor(entry.quantity)), 0),
        colors,
        facets: sortMetadataFacets([
          ...leaders.map((leader) => ({
            type: "leader",
            key: leader.cardId,
            label: leader.label,
            colors: leader.colors,
            members: [leader],
          })),
          ...buildColorMetadataFacets(colors),
        ]),
      };
    },
    normalizeTemplate(deck) {
      return deck
        .flatMap((entry) => {
          const card = onePieceCardByAnyId.get(entry.cardId);
          if (!card) return [];
          if (card.cardType === "leader") return [{ ...entry, quantity: 1 }];
          if (card.cardType === "don") return [];
          if (entry.quantity >= 4) return [{ ...entry, quantity: 4 }];
          if (entry.quantity >= 2) return [{ ...entry, quantity: 2 }];
          return [];
        })
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
    normalizeSynergy(deck) {
      return deck
        .filter((entry) => {
          const card = onePieceCardByAnyId.get(entry.cardId);
          if (!card) return false;
          return card.cardType !== "leader" && card.cardType !== "don" && entry.quantity > 1;
        })
        .map((entry) => ({ ...entry, quantity: 1 }))
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
  },

  createServerEngine: onePieceCreateServerEngine,
  serializeEngine: onePieceSerializeEngine,
  restoreEngine: onePieceRestoreEngine,
  extractCardsMapsFromSnapshot: onePieceExtractCardsMapsFromSnapshot,
};
