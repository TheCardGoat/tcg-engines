import { getAllCards, getCard, validateDeckForFormat as validateOnePieceDeck } from "@tcg/op-cards";
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
import { slugify } from "@tcg/shared/utils";
import {
  onePieceCreateServerEngine,
  onePieceExtractCardsMapsFromSnapshot,
  onePieceRestoreEngine,
  onePieceSerializeEngine,
} from "./one-piece-engine-lifecycle";
import { onePieceDeckInterchangeAdapter } from "./deck-interchange";

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
  deckInterchange: onePieceDeckInterchangeAdapter,

  createGameId(): string {
    return `one-piece-game-${crypto.randomUUID()}`;
  },

  generateUserName(gameProfileId: string): string {
    return `pirate-${gameProfileId.slice(0, 6)}`;
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    const instanceSections: Record<string, string> = {};
    let hasSections = false;
    for (const { owner, deck } of decks) {
      const ownerInstances: string[] = [];
      let counter = 0;
      for (const entry of deck) {
        for (let i = 0; i < entry.qty; i++) {
          const instanceId = `${owner}-${entry.cardId}-${counter++}`;
          cardInstances[instanceId] = entry.cardId;
          ownerInstances.push(instanceId);
          if (entry.sectionId) {
            instanceSections[instanceId] = entry.sectionId;
            hasSections = true;
          }
        }
      }
      owners[owner] = ownerInstances;
    }
    return hasSections ? { cardInstances, owners, instanceSections } : { cardInstances, owners };
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
    // Deck-construction rules (5-1-2 family) are owned by the game workspace;
    // this is a thin delegate so platform services keep one entry point.
    return validateOnePieceDeck(formatId, deck);
  },

  metadata: {
    projectionVersion: 2,
    capabilities: { colors: true, deckLists: true, archetypes: true },
    facets: [
      {
        type: "leader",
        label: "Leader",
        pluralLabel: "Leaders",
        kind: "identity",
        order: 10,
        ranking: { specialistSkill: true, mastery: true },
      },
      {
        type: "color",
        label: "Leader color",
        pluralLabel: "Leader colors",
        kind: "individual",
        order: 20,
        ranking: { specialistSkill: true, mastery: false },
      },
      {
        type: "color-combination",
        label: "Leader color combination",
        pluralLabel: "Leader color combinations",
        kind: "combination",
        order: 30,
        ranking: { specialistSkill: true, mastery: false },
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
        projectionVersion: 2,
        game: "one-piece",
        cardCount: deck.reduce((sum, entry) => sum + Math.max(0, Math.floor(entry.quantity)), 0),
        colors,
        facets: sortMetadataFacets([
          ...leaders.map((leader) => ({
            type: "leader",
            key: slugify(leader.label),
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
