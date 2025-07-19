import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

// Move for using an activated ability on a card
// An activated ability is one that starts with "⤵ —" in its text
// These abilities have a cost of exerting the card

export interface ActivatedAbilityParams {
  cardInstanceId: string; // Card with the activated ability
  abilityIndex?: number; // If the card has multiple activated abilities, the index of the one to use (0-based)
}

export const useActivatedAbility: LorcanaMove = (
  { G, coreOps, playerID },
  params: ActivatedAbilityParams,
) => {
  try {
    const lorcanaOps = toLorcanaCoreOps(coreOps);
    // Get ctx first, before using it
    const ctx = lorcanaOps.getCtx();

    // Ensure we're in the main phase
    if (ctx.currentPhase !== "mainPhase") {
      logger.error(
        `Cannot use activated ability during ${ctx.currentPhase} phase`,
      );
      return createInvalidMove(
        "WRONG_PHASE",
        "moves.useActivatedAbility.errors.wrongPhase",
        { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" },
      );
    }

    const { cardInstanceId, abilityIndex = 0 } = params;

    // Verify card exists
    const cardInstance = lorcanaOps.getCardInstance(cardInstanceId);
    if (!cardInstance) {
      logger.error(
        `Failed to get card instance ${cardInstanceId} or engine not available`,
      );
      return createInvalidMove(
        "CARD_NOT_FOUND",
        "moves.useActivatedAbility.errors.cardNotFound",
        { instanceId: cardInstanceId },
      );
    }

    const card = cardInstance;

    // Verify card is in play
    const cardZone = lorcanaOps.getCardZone(cardInstanceId);
    if (cardZone !== "play") {
      logger.error(`Card ${cardInstanceId} is not in play (zone: ${cardZone})`);
      return createInvalidMove(
        "CARD_NOT_IN_PLAY",
        "moves.useActivatedAbility.errors.cardNotInPlay",
        { instanceId: cardInstanceId, cardZone },
      );
    }

    // Verify card is controlled by the player
    const cardOwner = lorcanaOps.getCardOwner(cardInstanceId);
    if (cardOwner !== playerID) {
      logger.error(
        `Card ${cardInstanceId} is not controlled by player ${playerID}`,
      );
      return createInvalidMove(
        "CARD_NOT_CONTROLLED",
        "moves.useActivatedAbility.errors.cardNotControlled",
        { instanceId: cardInstanceId, playerId: playerID },
      );
    }

    // Verify card has activated abilities
    // This would require checking the card's text for the "⤵ —" symbol
    // For now we'll just assume it does

    // Check if card is already exerted
    if (card.isExerted) {
      logger.error(`Card ${cardInstanceId} is already exerted`);
      return createInvalidMove(
        "CARD_ALREADY_EXERTED",
        "moves.useActivatedAbility.errors.cardAlreadyExerted",
        { instanceId: cardInstanceId },
      );
    }

    // Exert the card to pay for the ability
    lorcanaOps.exertCard(cardInstanceId);

    // Add triggered effect to the bag
    lorcanaOps.addTriggeredEffectsToTheBag(
      "onActivatedAbility",
      cardInstanceId,
    );

    logger.info(
      `Player ${playerID} used activated ability ${abilityIndex} on card ${cardInstanceId}`,
    );

    return G;
  } catch (error) {
    logger.error(`Unexpected error in useActivatedAbilityMove: ${error}`);
    return createInvalidMove(
      "UNEXPECTED_ERROR",
      "moves.useActivatedAbility.errors.unexpectedError",
      {
        error: String(error),
        cardInstanceId: params?.cardInstanceId,
        playerId: playerID,
      },
    );
  }
};
