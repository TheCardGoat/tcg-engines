/**
 * Helper functions for creating and working with EnumerableMove objects
 */

import type { CoreCardInstance } from "../card/core-card-instance";
import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "../types/game-specific-types";
import type { EnumerableMove } from "./move-types";

/**
 * Factory function to create an EnumerableMove object with proper typing
 */
export function createEnumerableMove<
  G extends GameSpecificGameState = DefaultGameState,
  CD extends GameSpecificCardDefinition = DefaultCardDefinition,
  PS extends GameSpecificPlayerState = DefaultPlayerState,
  CF extends GameSpecificCardFilter = BaseCoreCardFilter,
  CI extends CoreCardInstance<CD> = CoreCardInstance<CD>,
  GE = unknown,
>(
  moveDefinition: EnumerableMove<G, CD, PS, CF, CI, GE>,
): EnumerableMove<G, CD, PS, CF, CI, GE> {
  return moveDefinition;
}

/**
 * Create an error result object for move execution
 */
export function createMoveError(
  type: string,
  message: string,
  context: Record<string, unknown> = {},
): {
  error: { type: string; message: string; context?: Record<string, unknown> };
} {
  return {
    error: {
      type,
      message,
      ...(Object.keys(context).length > 0 ? { context } : {}),
    },
  };
}

/**
 * Helper to extract a move's priority or return a default value
 */
export function getMovePriority<
  G extends GameSpecificGameState = DefaultGameState,
  CD extends GameSpecificCardDefinition = DefaultCardDefinition,
  PS extends GameSpecificPlayerState = DefaultPlayerState,
  CF extends GameSpecificCardFilter = BaseCoreCardFilter,
  CI extends CoreCardInstance<CD> = CoreCardInstance<CD>,
  GE = unknown,
>(
  move: EnumerableMove<G, CD, PS, CF, CI, GE>,
  context: any,
  defaultPriority = 0,
): number {
  if (!move.getPriority) return defaultPriority;

  try {
    return move.getPriority(context);
  } catch (error) {
    console.error(`Error getting move priority: ${error}`);
    return defaultPriority;
  }
}

/**
 * Helper to safely get move constraints
 */
export function getMoveConstraints<
  G extends GameSpecificGameState = DefaultGameState,
  CD extends GameSpecificCardDefinition = DefaultCardDefinition,
  PS extends GameSpecificPlayerState = DefaultPlayerState,
  CF extends GameSpecificCardFilter = BaseCoreCardFilter,
  CI extends CoreCardInstance<CD> = CoreCardInstance<CD>,
  GE = unknown,
>(
  move: EnumerableMove<G, CD, PS, CF, CI, GE>,
  context: any,
): ReturnType<NonNullable<typeof move.getConstraints>> {
  if (!move.getConstraints) return [];

  try {
    return move.getConstraints(context);
  } catch (error) {
    console.error(`Error getting move constraints: ${error}`);
    return [];
  }
}

/**
 * Helper to safely get target specifications
 */
export function getTargetSpecs<
  G extends GameSpecificGameState = DefaultGameState,
  CD extends GameSpecificCardDefinition = DefaultCardDefinition,
  PS extends GameSpecificPlayerState = DefaultPlayerState,
  CF extends GameSpecificCardFilter = BaseCoreCardFilter,
  CI extends CoreCardInstance<CD> = CoreCardInstance<CD>,
  GE = unknown,
>(
  move: EnumerableMove<G, CD, PS, CF, CI, GE>,
  context: any,
  ...args: unknown[]
): ReturnType<NonNullable<typeof move.getTargetSpecs>> {
  if (!move.getTargetSpecs) return [];

  try {
    return move.getTargetSpecs(context, ...args);
  } catch (error) {
    console.error(`Error getting target specs: ${error}`);
    return [];
  }
}
