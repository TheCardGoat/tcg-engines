/**
 * Card repository for One Piece TCG
 * Extends CoreEngine's card repository with One Piece-specific functionality
 */

import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import { allOnePieceCardsById } from "./definitions/cards";
import type { OnePieceCard } from "./definitions/cardTypes";

export class OnePieceCardRepository extends CardRepository<OnePieceCard> {
  constructor(cards: Record<string, Record<string, string>>) {
    super(cards, allOnePieceCardsById);

    // Validate and populate the repository
    this.validateAndPopulate(cards);
  }

  private validateAndPopulate(cards: Record<string, Record<string, string>>) {
    const allInstanceIds = new Set<string>();

    for (const [playerId, playerCards] of Object.entries(cards)) {
      for (const [instanceId, publicId] of Object.entries(playerCards)) {
        // Validate unique instance IDs
        if (allInstanceIds.has(instanceId)) {
          throw new Error(`Duplicate instance ID found: ${instanceId}`);
        }
        allInstanceIds.add(instanceId);

        // Validate card exists in definitions
        const cardDefinition = allOnePieceCardsById[publicId];
        if (!cardDefinition) {
          throw new Error(`Card definition not found for ID: ${publicId}`);
        }

        // Add to repository (using parent method)
        // this.addCard(instanceId, publicId, cardDefinition);
      }
    }
  }

  /**
   * Get card definition by public ID
   */
  getCardByPublicId(publicId: string): OnePieceCard | undefined {
    return allOnePieceCardsById[publicId];
  }

  /**
   * Get card definition by instance ID
   */
  getCardByInstanceId(instanceId: string): OnePieceCard | undefined {
    // TODO: Implement when parent class provides proper access
    return undefined;
  }

  /**
   * Get all cards by category
   */
  getCardsByCategory(category: string): OnePieceCard[] {
    return Object.values(allOnePieceCardsById).filter(
      (card) => card.category === category,
    );
  }

  /**
   * Get all leaders
   */
  getLeaders(): OnePieceCard[] {
    return this.getCardsByCategory("leader");
  }

  /**
   * Get all characters
   */
  getCharacters(): OnePieceCard[] {
    return this.getCardsByCategory("character");
  }

  /**
   * Get all events
   */
  getEvents(): OnePieceCard[] {
    return this.getCardsByCategory("event");
  }

  /**
   * Get all stages
   */
  getStages(): OnePieceCard[] {
    return this.getCardsByCategory("stage");
  }

  /**
   * Get all DON!! cards
   */
  getDonCards(): OnePieceCard[] {
    return this.getCardsByCategory("don");
  }

  /**
   * Get cards eligible for deck construction with given leader
   */
  getDeckEligibleCards(leaderColors: string[]): OnePieceCard[] {
    return Object.values(allOnePieceCardsById).filter((card) => {
      // Exclude leaders and DON!! cards from deck
      if (card.category === "leader" || card.category === "don") {
        return false;
      }

      // Card must share at least one color with leader or be colorless
      return (
        card.colors.length === 0 ||
        card.colors.some((color) => leaderColors.includes(color as string))
      );
    });
  }

  /**
   * Validate deck construction rules
   */
  validateDeck(
    leaderPublicId: string,
    deckCardIds: string[],
  ): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Get leader card
    const leader = this.getCardByPublicId(leaderPublicId);
    if (!leader) {
      errors.push(`Leader card not found: ${leaderPublicId}`);
      return { valid: false, errors };
    }

    if (leader.category !== "leader") {
      errors.push(`Card is not a leader: ${leaderPublicId}`);
    }

    // Validate deck size (should be exactly 50 cards)
    if (deckCardIds.length !== 50) {
      errors.push(
        `Deck must contain exactly 50 cards, found ${deckCardIds.length}`,
      );
    }

    // Count card copies and validate eligibility
    const cardCounts: Record<string, number> = {};
    const leaderColors = leader.colors;

    for (const cardId of deckCardIds) {
      const card = this.getCardByPublicId(cardId);
      if (!card) {
        errors.push(`Card not found: ${cardId}`);
        continue;
      }

      // Count copies
      cardCounts[cardId] = (cardCounts[cardId] || 0) + 1;

      // Validate card can be in deck
      if (card.category === "leader") {
        errors.push(`Leaders cannot be in deck: ${cardId}`);
      }

      if (card.category === "don") {
        errors.push(`DON!! cards cannot be in deck: ${cardId}`);
      }

      // Validate color requirements
      if (
        card.colors.length > 0 &&
        !card.colors.some((color) => leaderColors.includes(color))
      ) {
        errors.push(`Card ${cardId} colors don't match leader colors`);
      }
    }

    // Validate copy limits (max 4 copies of any card)
    for (const [cardId, count] of Object.entries(cardCounts)) {
      if (count > 4) {
        errors.push(`Too many copies of ${cardId}: ${count}/4`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create standard DON!! deck (10 DON!! cards)
   */
  createStandardDonDeck(): string[] {
    const donCards = this.getDonCards();
    if (donCards.length === 0) {
      throw new Error("No DON!! cards available");
    }

    // Use basic DON!! token for all 10 cards
    const basicDon = donCards.find((card) => card.id === "DON-TOKEN-001");
    if (!basicDon) {
      throw new Error("Basic DON!! token not found");
    }

    return Array(10).fill(basicDon.id);
  }

  /**
   * Get implementation statistics
   */
  getImplementationStats(): {
    total: number;
    implemented: number;
    byCategory: Record<string, { total: number; implemented: number }>;
  } {
    const allCards = Object.values(allOnePieceCardsById);
    const stats = {
      total: allCards.length,
      implemented: allCards.filter((card) => card.implemented).length,
      byCategory: {} as Record<string, { total: number; implemented: number }>,
    };

    // Calculate by category
    for (const card of allCards) {
      const category = card.category;
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = { total: 0, implemented: 0 };
      }
      stats.byCategory[category].total++;
      if (card.implemented) {
        stats.byCategory[category].implemented++;
      }
    }

    return stats;
  }
}
