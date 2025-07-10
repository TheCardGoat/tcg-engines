import type { GameCards } from "~/game-engine/core-engine/types";

// CoreCardDefinition interface now in core-card-instance-store.ts
interface CoreCardDefinition {
  id: string;
}

/**
 * Generic factory function to create card repositories without inheritance boilerplate
 * Eliminates the need for game-specific repository classes
 */
export function createCardRepository<TCard extends CoreCardDefinition>(
  dictionary: GameCards,
  cardLookup: Record<string, TCard>,
  options: {
    validateDuplicates?: boolean;
    errorPrefix?: string;
  } = {},
): Record<string, TCard> {
  const { validateDuplicates = true, errorPrefix = "CardRepository" } = options;

  const cards: Record<string, TCard> = {};
  const seenInstanceIds = new Set<string>();

  // Validate dictionary parameter
  if (!dictionary) {
    throw new Error(`${errorPrefix}: dictionary cannot be null or undefined`);
  }

  // Process each player's cards
  for (const [playerId, playerCards] of Object.entries(dictionary)) {
    for (const [instanceId, publicId] of Object.entries(playerCards)) {
      // Validate unique instance IDs if enabled
      if (validateDuplicates && seenInstanceIds.has(instanceId)) {
        throw new Error(
          `${errorPrefix}: Duplicate instanceId detected: ${instanceId}. Player: ${playerId}, PublicId: ${publicId}`,
        );
      }
      seenInstanceIds.add(instanceId);

      // Look up card definition
      const cardDefinition = cardLookup[publicId];
      if (cardDefinition) {
        cards[instanceId] = {
          id: publicId,
          ...cardDefinition,
        } as TCard;
      } else {
        // Optionally warn about missing cards instead of failing
        console.warn(
          `${errorPrefix}: Card definition not found for publicId: ${publicId}`,
        );
      }
    }
  }

  return cards;
}

/**
 * Simplified card repository interface
 * Combines the functionality of CoreCardDefinitionRepository with a cleaner API
 */
export class CardRepository<TCard extends CoreCardDefinition> {
  private cards: Record<string, TCard>;
  readonly dictionary: GameCards;

  constructor(
    dictionary: GameCards,
    cardLookup: Record<string, TCard>,
    options?: {
      validateDuplicates?: boolean;
      errorPrefix?: string;
    },
  ) {
    this.dictionary = dictionary;
    this.cards = createCardRepository(dictionary, cardLookup, options);
  }

  /**
   * Get card definition by instance ID
   */
  getCardByInstanceId(instanceId: string): TCard | undefined {
    return this.cards[instanceId];
  }

  /**
   * Get card definition by public ID (slower, iterates through all cards)
   */
  getCardByPublicId(publicId: string): TCard | undefined {
    for (const [_instanceId, cardData] of Object.entries(this.cards)) {
      if (cardData.id === publicId) {
        return cardData;
      }
    }
    return undefined;
  }

  /**
   * Get all card definitions
   */
  getAllCards(): Record<string, TCard> {
    return { ...this.cards }; // Return copy to prevent mutation
  }

  /**
   * Get card definitions for a specific player
   */
  getPlayerCards(playerId: string): TCard[] {
    const playerCards = this.dictionary[playerId] || {};
    return Object.keys(playerCards)
      .map((instanceId) => this.cards[instanceId])
      .filter(Boolean);
  }

  /**
   * Check if a card instance exists
   */
  hasCard(instanceId: string): boolean {
    return instanceId in this.cards;
  }

  /**
   * Get card statistics
   */
  getStats(): {
    totalCards: number;
    playersCount: number;
    uniquePublicIds: number;
  } {
    const uniquePublicIds = new Set(
      Object.values(this.cards).map((card) => card.id),
    );

    return {
      totalCards: Object.keys(this.cards).length,
      playersCount: Object.keys(this.dictionary).length,
      uniquePublicIds: uniquePublicIds.size,
    };
  }
}
