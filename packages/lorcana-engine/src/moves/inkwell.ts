/**
 * Inkwell Move (Rule 4.3.3)
 *
 * Put card into inkwell logic:
 * - Once per turn limit
 * - Card must have inkwell symbol (inkable)
 * - Card must be in hand
 * - Places card facedown and ready
 */

import type { TurnTrackers } from "../flow/turn-types";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId } from "../types/game-state";
import {
  invalidMove,
  type MoveValidationResult,
  validMove,
} from "./move-types";

/**
 * Validate putting a card into inkwell
 */
export function validatePutIntoInkwell(
  card: LorcanaCardDefinition | undefined,
  isInHand: boolean,
  turnTrackers: TurnTrackers,
  isActivePlayer: boolean,
  isMainPhase: boolean,
): MoveValidationResult {
  const errors = [];

  // Must be active player's turn
  if (!isActivePlayer) {
    errors.push({ type: "NOT_YOUR_TURN" as const });
  }

  // Must be main phase
  if (!isMainPhase) {
    errors.push({ type: "NOT_MAIN_PHASE" as const });
  }

  // Card must exist
  if (!card) {
    errors.push({ type: "CARD_NOT_FOUND" as const });
    return invalidMove(...errors);
  }

  // Card must be in hand
  if (!isInHand) {
    errors.push({ type: "NOT_IN_HAND" as const });
  }

  // Card must be inkable (have inkwell symbol)
  if (!card.inkable) {
    errors.push({ type: "CARD_NOT_INKABLE" as const });
  }

  // Can only ink once per turn
  if (turnTrackers.hasInked) {
    errors.push({ type: "ALREADY_INKED_THIS_TURN" as const });
  }

  if (errors.length > 0) {
    return invalidMove(...errors);
  }

  return validMove();
}

/**
 * Check if a card can be put into inkwell
 */
export function canPutIntoInkwell(
  card: LorcanaCardDefinition | undefined,
  isInHand: boolean,
  turnTrackers: TurnTrackers,
  isActivePlayer: boolean,
  isMainPhase: boolean,
): boolean {
  const result = validatePutIntoInkwell(
    card,
    isInHand,
    turnTrackers,
    isActivePlayer,
    isMainPhase,
  );
  return result.valid;
}

/**
 * Get all cards that can be put into inkwell from a hand
 */
export function getInkableCardsInHand(
  handCards: Array<{ cardId: CardId; definition: LorcanaCardDefinition }>,
  turnTrackers: TurnTrackers,
  isActivePlayer: boolean,
  isMainPhase: boolean,
): CardId[] {
  // Can't ink if already inked this turn
  if (turnTrackers.hasInked || !isActivePlayer || !isMainPhase) {
    return [];
  }

  return handCards
    .filter(({ definition }) => definition.inkable)
    .map(({ cardId }) => cardId);
}
