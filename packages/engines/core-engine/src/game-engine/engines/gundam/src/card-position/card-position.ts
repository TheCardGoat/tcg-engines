import type { CardType, ZoneType } from "../gundam-engine-types";
import type { Result } from "../shared/result";

/**
 * Card position states according to Gundam Card Game rules (Rule 4-4)
 * - Active: Card is placed vertically, ready to take action
 * - Rested: Card is placed horizontally, has finished taking action
 */
export type CardPosition = "active" | "rested";

/**
 * Minimal card instance for position tracking
 */
export type CardInstance = {
  id: string;
  cardType: CardType;
  position: CardPosition;
  zone: ZoneType;
  ownerId: string;
};

/**
 * Position operation error types
 */
export type CardPositionError = {
  type: "alreadyInPosition";
  currentPosition: CardPosition;
  targetPosition: CardPosition;
  cardId: string;
};

/**
 * Get the current position of a card
 */
export const getCardPosition = (card: CardInstance): CardPosition => {
  return card.position;
};

/**
 * Check if a card is in active position
 */
export const isCardActive = (card: CardInstance): boolean => {
  return card.position === "active";
};

/**
 * Check if a card is in rested position
 */
export const isCardRested = (card: CardInstance): boolean => {
  return card.position === "rested";
};

/**
 * Check if a card can be rested
 * Rule 1-3-2-1: Cannot rest a card that is already rested
 */
export const canRestCard = (card: CardInstance): boolean => {
  return card.position === "active";
};

/**
 * Check if a card can be activated
 * Rule 1-3-2-1: Cannot activate a card that is already active
 */
export const canActivateCard = (card: CardInstance): boolean => {
  return card.position === "rested";
};

/**
 * Rest a card (transition from active to rested)
 * Rule 4-4-3: Active means a card has not yet taken an action
 * Rule 4-4-5: Rested means a card has finished taking an action
 * Rule 1-3-2-1: If required to put entity into state it's already in, action not performed
 *
 * @param card - The card to rest
 * @returns Result containing new card state on success, or error if already rested
 */
export const restCard = (
  card: CardInstance,
): Result<CardInstance, CardPositionError> => {
  // Rule 1-3-2-1: Cannot rest an already rested card
  if (card.position === "rested") {
    return {
      success: false,
      error: {
        type: "alreadyInPosition",
        currentPosition: "rested",
        targetPosition: "rested",
        cardId: card.id,
      },
    };
  }

  // Create new card with rested position (immutable update)
  return {
    success: true,
    data: {
      ...card,
      position: "rested",
    },
  };
};

/**
 * Activate a card (transition from rested to active)
 * Rule 4-4-3: Active means a card has not yet taken an action
 * Rule 1-3-2-1: If required to put entity into state it's already in, action not performed
 *
 * @param card - The card to activate
 * @returns Result containing new card state on success, or error if already active
 */
export const activateCard = (
  card: CardInstance,
): Result<CardInstance, CardPositionError> => {
  // Rule 1-3-2-1: Cannot activate an already active card
  if (card.position === "active") {
    return {
      success: false,
      error: {
        type: "alreadyInPosition",
        currentPosition: "active",
        targetPosition: "active",
        cardId: card.id,
      },
    };
  }

  // Create new card with active position (immutable update)
  return {
    success: true,
    data: {
      ...card,
      position: "active",
    },
  };
};
