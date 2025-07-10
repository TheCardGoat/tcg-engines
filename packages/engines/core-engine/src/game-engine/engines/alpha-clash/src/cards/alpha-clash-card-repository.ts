/**
 * Alpha Clash Card Repository
 *
 * Manages card definitions and provides lookup functionality
 * for Alpha Clash cards. Extends the CoreEngine card repository.
 */

import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GameCards } from "~/game-engine/core-engine/types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { AlphaClashCardDefinition } from "../../alpha-clash-engine-types";
import {
  allAlphaClashCardsById,
  validateCardRegistry,
} from "./definitions/cards";

export class AlphaClashCardRepository extends CardRepository<AlphaClashCardDefinition> {
  constructor(cards: Record<string, Record<string, string>>) {
    const processedCards = AlphaClashCardRepository.processCards(cards);
    const dictionary = AlphaClashCardRepository.createDictionary(cards);

    super(dictionary, processedCards);
  }

  /**
   * Process cards for CardRepository format
   */
  private static processCards(
    cards: Record<string, Record<string, string>>,
  ): Record<string, AlphaClashCardDefinition> {
    const processedCards: Record<string, AlphaClashCardDefinition> = {};
    const allInstanceIds = new Set<string>();

    // Validate card registry first
    const validationErrors = validateCardRegistry();
    if (validationErrors.length > 0) {
      throw new Error(
        `Card registry validation failed: ${validationErrors.join(", ")}`,
      );
    }

    logger.info("Processing Alpha Clash cards for repository");

    for (const [playerId, playerCards] of Object.entries(cards)) {
      logger.debug(`Processing cards for player: ${playerId}`);

      for (const [instanceId, publicId] of Object.entries(playerCards)) {
        // Validate unique instance IDs across all players
        if (allInstanceIds.has(instanceId)) {
          const error = `Duplicate instance ID found: ${instanceId}`;
          logger.error(error);
          throw new Error(error);
        }
        allInstanceIds.add(instanceId);

        // Get card definition from registry
        const cardDefinition = allAlphaClashCardsById[
          publicId
        ] as AlphaClashCardDefinition;
        if (!cardDefinition) {
          const error = `Card definition not found for public ID: ${publicId}`;
          logger.error(error);
          throw new Error(error);
        }

        processedCards[instanceId] = cardDefinition;
      }
    }

    logger.info(
      `Alpha Clash card repository processed ${Object.keys(processedCards).length} card instances`,
    );
    return processedCards;
  }

  /**
   * Create dictionary for CardRepository
   */
  private static createDictionary(
    cards: Record<string, Record<string, string>>,
  ): GameCards {
    const dictionary: GameCards = {};

    for (const [playerId, playerCards] of Object.entries(cards)) {
      dictionary[playerId] = playerCards;
    }

    return dictionary;
  }

  /**
   * Validate a card can be played based on its properties
   */
  canPlayCard(
    instanceId: string,
    context: { phase: string; priorityWindow?: string },
  ): boolean {
    const card = this.getCardByInstanceId(instanceId);
    if (!card) return false;

    // Basic Actions can only be played during Primary Phase
    if (
      card.type === "action" &&
      card.subtype === "basic" &&
      context.phase !== "primary"
    ) {
      return false;
    }

    // Clash Buffs can only be played during Clash Phase
    if (
      card.type === "action" &&
      card.subtype === "clash-buff" &&
      context.phase !== "clash"
    ) {
      return false;
    }

    // Quick Actions need appropriate priority window
    if (
      card.type === "action" &&
      card.subtype === "quick" &&
      !context.priorityWindow
    ) {
      return false;
    }

    // Traps can only be set during Primary Phase
    if (
      card.type === "accessory" &&
      card.subtype === "trap" &&
      context.phase !== "primary"
    ) {
      return false;
    }

    return true;
  }
}
