import { produce } from "immer";
import type { GameMoveDefinition } from "../game-definition/move-definitions";
import type { MoveContext, MoveResult } from "./move-system";

/**
 * Generic move map type for runtime lookup
 *
 * Used by executor functions that need to look up moves by string ID.
 * For type-safe move definitions in game definitions, use GameMoveDefinitions instead.
 */
type GenericMoveMap<TGameState> = Record<
  string,
  GameMoveDefinition<TGameState>
>;

/**
 * Execute a move with full validation pipeline
 *
 * Pipeline:
 * 1. Validate move exists
 * 2. Check condition (if present)
 * 3. Execute reducer with Immer
 * 4. Return result (success or failure)
 *
 * @param state - Current game state
 * @param moveId - ID of move to execute
 * @param context - Move context
 * @param moves - Available moves
 * @returns MoveResult with new state or error
 *
 * @example
 * ```typescript
 * const result = executeMove(
 *   gameState,
 *   'draw-card',
 *   { playerId: 'p1' },
 *   gameMoves
 * );
 *
 * if (result.success) {
 *   gameState = result.state;
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function executeMove<TGameState>(
  state: TGameState,
  moveId: string,
  context: MoveContext,
  moves: GenericMoveMap<TGameState>,
): MoveResult<TGameState> {
  // 1. Validate move exists
  const moveDef = moves[moveId];
  if (!moveDef) {
    return {
      success: false,
      error: `Move '${moveId}' does not exist`,
      errorCode: "MOVE_NOT_FOUND",
      errorContext: { moveId },
    };
  }

  // 2. Check condition
  if (moveDef.condition) {
    try {
      const isValid = moveDef.condition(state, context);
      if (!isValid) {
        return {
          success: false,
          error: `Move '${moveId}' condition not met`,
          errorCode: "CONDITION_FAILED",
          errorContext: { moveId },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Error checking condition for move '${moveId}': ${error instanceof Error ? error.message : String(error)}`,
        errorCode: "CONDITION_ERROR",
        errorContext: {
          moveId,
          originalError: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  // 3. Execute reducer
  try {
    const nextState = produce(state, (draft) => {
      moveDef.reducer(draft, context);
    });

    return {
      success: true,
      state: nextState,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error executing move '${moveId}': ${error instanceof Error ? error.message : String(error)}`,
      errorCode: "EXECUTION_ERROR",
      errorContext: {
        moveId,
        originalError: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

/**
 * Check if a move can be executed without actually executing it
 *
 * Validates:
 * 1. Move exists
 * 2. Condition passes (if present)
 *
 * Does NOT execute the reducer or modify state.
 *
 * @param state - Current game state
 * @param moveId - ID of move to check
 * @param context - Move context
 * @param moves - Available moves
 * @returns True if move can be executed
 *
 * @example
 * ```typescript
 * if (canExecuteMove(gameState, 'play-card', context, moves)) {
 *   const result = executeMove(gameState, 'play-card', context, moves);
 * }
 * ```
 */
export function canExecuteMove<TGameState>(
  state: TGameState,
  moveId: string,
  context: MoveContext,
  moves: GenericMoveMap<TGameState>,
): boolean {
  const moveDef = moves[moveId];
  if (!moveDef) {
    return false;
  }

  if (!moveDef.condition) {
    return true; // No condition means always valid
  }

  try {
    const result = moveDef.condition(state, context);
    return result === true; // Support both boolean and ConditionFailure returns
  } catch {
    return false; // Condition error = invalid
  }
}

/**
 * Get move definition by ID
 *
 * @param moveId - ID of move to retrieve
 * @param moves - Available moves
 * @returns Move definition or undefined
 */
export function getMove<TGameState>(
  moveId: string,
  moves: GenericMoveMap<TGameState>,
): GameMoveDefinition<TGameState> | undefined {
  return moves[moveId];
}

/**
 * Get all move IDs
 *
 * @param moves - Available moves
 * @returns Array of move IDs
 */
export function getMoveIds<TGameState>(
  moves: GenericMoveMap<TGameState>,
): string[] {
  return Object.keys(moves);
}

/**
 * Check if a move exists
 *
 * @param moveId - ID of move to check
 * @param moves - Available moves
 * @returns True if move exists
 */
export function moveExists<TGameState>(
  moveId: string,
  moves: GenericMoveMap<TGameState>,
): boolean {
  return moveId in moves;
}
