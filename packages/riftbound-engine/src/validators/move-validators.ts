/**
 * Riftbound Move Validators
 *
 * Validation logic for game moves.
 */

import type { PlayerId, RiftboundState } from "../types";
import type { MoveValidationError } from "../types/move-enumeration";

/**
 * Validation result
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: MoveValidationError[];
}

/**
 * Create a successful validation result
 */
export function validResult(): ValidationResult {
  return { isValid: true, errors: [] };
}

/**
 * Create a failed validation result
 */
export function invalidResult(
  ...errors: MoveValidationError[]
): ValidationResult {
  return { isValid: false, errors };
}

/**
 * Validate that it's the player's turn
 *
 * @param state - Current game state
 * @param playerId - Player attempting the move
 * @returns Validation result
 */
export function validateActivePlayer(
  state: RiftboundState,
  playerId: PlayerId,
): ValidationResult {
  if (state.turn.activePlayer !== playerId) {
    return invalidResult({
      code: "NOT_ACTIVE_PLAYER",
      message: "It is not your turn",
    });
  }
  return validResult();
}

/**
 * Validate that the game is in progress
 *
 * @param state - Current game state
 * @returns Validation result
 */
export function validateGameInProgress(
  state: RiftboundState,
): ValidationResult {
  if (state.status !== "playing") {
    return invalidResult({
      code: "GAME_NOT_IN_PROGRESS",
      message: `Game is in ${state.status} state`,
    });
  }
  return validResult();
}

/**
 * Combine multiple validation results
 *
 * @param results - Validation results to combine
 * @returns Combined validation result
 */
export function combineValidations(
  ...results: ValidationResult[]
): ValidationResult {
  const errors: MoveValidationError[] = [];

  for (const result of results) {
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  }

  return errors.length > 0 ? invalidResult(...errors) : validResult();
}
