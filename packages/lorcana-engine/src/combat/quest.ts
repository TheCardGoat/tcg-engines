/**
 * Quest Action (Rule 4.3.5)
 *
 * Quest logic:
 * - Character must be ready and dry
 * - Character cannot have Reckless
 * - Exerts the character
 * - Gains lore equal to character's lore value
 */

import { getLoreValue, hasReckless, isCharacter } from "../card-utils";
import type { MoveValidationResult } from "../moves/move-types";
import { invalidMove, validMove } from "../moves/move-types";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import type { CardInstanceState } from "../zones/card-state";

/**
 * Validate quest action
 */
export function validateQuest(
  card: LorcanaCardDefinition | undefined,
  cardState: CardInstanceState | undefined,
  cardOwner: PlayerId,
  activePlayerId: PlayerId,
  isMainPhase: boolean,
): MoveValidationResult {
  const errors = [];

  // Must be active player's turn
  if (cardOwner !== activePlayerId) {
    errors.push({ type: "NOT_YOUR_CHARACTER" as const });
  }

  if (!isMainPhase) {
    errors.push({ type: "NOT_MAIN_PHASE" as const });
  }

  // Card must exist
  if (!card) {
    errors.push({ type: "NOT_IN_PLAY" as const });
    return invalidMove(...errors);
  }

  // Must be a character
  if (!isCharacter(card)) {
    errors.push({ type: "NOT_A_CHARACTER" as const });
  }

  // Must be in play (have state)
  if (!cardState) {
    errors.push({ type: "NOT_IN_PLAY" as const });
    return invalidMove(...errors);
  }

  // Must be ready (Rule 4.3.5.4)
  if (cardState.state === "exerted") {
    errors.push({ type: "NOT_READY" as const });
  }

  // Must be dry - not drying (Rule 4.3.5.5)
  if (cardState.isDrying) {
    errors.push({ type: "NOT_DRY" as const });
  }

  // Cannot have Reckless (Rule 4.3.5.6)
  if (hasReckless(card)) {
    errors.push({ type: "HAS_RECKLESS" as const });
  }

  if (errors.length > 0) {
    return invalidMove(...errors);
  }

  return validMove();
}

/**
 * Check if a character can quest
 */
export function canQuest(
  card: LorcanaCardDefinition | undefined,
  cardState: CardInstanceState | undefined,
  cardOwner: PlayerId,
  activePlayerId: PlayerId,
  isMainPhase: boolean,
): boolean {
  const result = validateQuest(
    card,
    cardState,
    cardOwner,
    activePlayerId,
    isMainPhase,
  );
  return result.valid;
}

/**
 * Get lore gained from questing
 */
export function getQuestLore(card: LorcanaCardDefinition): number {
  return getLoreValue(card);
}

/**
 * Get all characters that can quest
 */
export function getQuestableCharacters(
  characters: Array<{
    cardId: CardId;
    card: LorcanaCardDefinition;
    state: CardInstanceState;
    owner: PlayerId;
  }>,
  activePlayerId: PlayerId,
  isMainPhase: boolean,
): CardId[] {
  return characters
    .filter(({ card, state, owner }) =>
      canQuest(card, state, owner, activePlayerId, isMainPhase),
    )
    .map(({ cardId }) => cardId);
}
