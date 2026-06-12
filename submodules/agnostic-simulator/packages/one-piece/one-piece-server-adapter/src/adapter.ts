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
  onePieceCreateServerEngine,
  onePieceExtractCardsMapsFromSnapshot,
  onePieceRestoreEngine,
  onePieceSerializeEngine,
} from "./one-piece-engine-lifecycle";

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
    if (hasCard(publicId)) {
      const card = getCard(publicId);
      return {
        publicId,
        colors: card.color,
      };
    }
    for (const card of getAllCards()) {
      if (card.id === publicId) {
        return {
          publicId,
          colors: card.color,
        };
      }
    }
    return null;
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

    return {
      formatId,
      label: "Standard",
      valid: totalCount > 0 && leaderCount === 1,
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
      ],
    };
  },

  createServerEngine: onePieceCreateServerEngine,
  serializeEngine: onePieceSerializeEngine,
  restoreEngine: onePieceRestoreEngine,
  extractCardsMapsFromSnapshot: onePieceExtractCardsMapsFromSnapshot,
};
