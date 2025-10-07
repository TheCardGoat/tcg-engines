import type { DefinitionRegistry } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import {
  type TargetContext,
  validateTargetSelection,
} from "../targeting/target-validation";
import type { PlayerId } from "../types";
import type {
  MoveDefinition,
  MoveInstance,
  MoveValidationResult,
} from "./move-definition";

/**
 * Validates if a move instance is legal given the current game state
 * @param moveInstance - The move instance to validate
 * @param moveDefinition - The move definition
 * @param state - Current game state
 * @param registry - Card definition registry
 * @returns Validation result
 */
export function validateMove<
  TCustomState = unknown,
  TGameState extends { cards: Record<string, CardInstance<TCustomState>> } = {
    cards: Record<string, CardInstance<TCustomState>>;
  },
>(
  moveInstance: MoveInstance,
  moveDefinition: MoveDefinition<TGameState>,
  state: TGameState,
  registry: DefinitionRegistry,
): MoveValidationResult {
  // Validate targets if move requires targeting
  if (moveDefinition.targets && moveDefinition.targets.length > 0) {
    if (!moveInstance.targets || moveInstance.targets.length === 0) {
      return {
        valid: false,
        error: "Move requires targets but none were provided",
        invalidTargets: [],
      };
    }

    // Validate each target group
    for (let i = 0; i < moveDefinition.targets.length; i++) {
      const targetDef = moveDefinition.targets[i];
      const selectedTargets = moveInstance.targets[i] || [];

      // Convert CardIds to CardInstances
      const targetCards = selectedTargets
        .map((targetId) => state.cards[targetId])
        .filter((card) => card !== undefined);

      if (targetCards.length !== selectedTargets.length) {
        return {
          valid: false,
          error: `Some target cards at index ${i} do not exist in game state`,
          invalidTargets: [i],
        };
      }

      // Get source card if specified
      const sourceCard = moveInstance.sourceCardId
        ? state.cards[moveInstance.sourceCardId]
        : undefined;

      if (moveInstance.sourceCardId && !sourceCard) {
        return {
          valid: false,
          error: "Source card does not exist in game state",
        };
      }

      // Create target context
      const context: Omit<TargetContext<TCustomState>, "previousTargets"> = {
        sourceCard:
          sourceCard ||
          ({
            id: moveInstance.sourceCardId || ("" as any),
            owner: moveInstance.playerId,
            controller: moveInstance.playerId,
          } as any),
        controller: moveInstance.playerId,
      };

      // Validate target selection
      const validationResult = validateTargetSelection(
        targetCards,
        targetDef,
        state,
        registry,
        context,
      );

      if (!validationResult.valid) {
        return {
          valid: false,
          error: `Invalid targets at index ${i}: ${validationResult.error}`,
          invalidTargets: [i],
        };
      }
    }
  }

  // Validate preconditions if specified
  if (moveDefinition.preconditions) {
    if (moveDefinition.preconditions.isLegal) {
      const isLegal = moveDefinition.preconditions.isLegal(
        moveInstance.playerId,
        state,
      );
      if (!isLegal) {
        return {
          valid: false,
          error: "Move precondition check failed",
        };
      }
    }

    // Validate source filter if specified
    if (
      moveDefinition.preconditions.sourceFilter &&
      moveInstance.sourceCardId
    ) {
      const sourceCard = state.cards[moveInstance.sourceCardId];
      if (!sourceCard) {
        return {
          valid: false,
          error: "Source card not found",
        };
      }
      // Note: Actual filter matching would require matchesFilter from filtering module
      // For now, we assume it's valid if the card exists
    }
  }

  return { valid: true };
}

/**
 * Checks if a move can be performed (simplified cost check)
 * @param moveDefinition - The move definition
 * @param playerId - Player attempting the move
 * @param state - Current game state
 * @returns True if move can be performed
 */
export function canPerformMove<TGameState = unknown>(
  moveDefinition: MoveDefinition<TGameState>,
  playerId: PlayerId,
  state: TGameState,
): boolean {
  // Check preconditions
  if (moveDefinition.preconditions?.isLegal) {
    return moveDefinition.preconditions.isLegal(playerId, state);
  }

  // Check custom cost predicate
  if (moveDefinition.cost?.custom) {
    return moveDefinition.cost.custom(playerId, state);
  }

  // If no preconditions or costs specified, move can be performed
  return true;
}

/**
 * Gets all legal moves for a player
 * @param moveDefinitions - Available move definitions
 * @param playerId - Player ID
 * @param state - Current game state
 * @returns Array of legal move definitions
 */
export function getLegalMoves<TGameState = unknown>(
  moveDefinitions: MoveDefinition<TGameState>[],
  playerId: PlayerId,
  state: TGameState,
): MoveDefinition<TGameState>[] {
  return moveDefinitions.filter((moveDef) =>
    canPerformMove(moveDef, playerId, state),
  );
}
