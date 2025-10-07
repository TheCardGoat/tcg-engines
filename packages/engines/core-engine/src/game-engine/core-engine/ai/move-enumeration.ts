/**
 * AI Move Enumeration
 *
 * Provides utilities for enumerating valid moves for AI players.
 * Supports efficient move counting, target enumeration, and move validation.
 */

import type { CardInstance } from "../card-instance/card-instance-types";
import type { CardId, PlayerId } from "../types/branded-types";

/**
 * Enumerated move with evaluation metadata for AI
 */
export type EnumeratedMove = {
  /** Name of the move */
  moveName: string;

  /** Player executing the move */
  playerId: PlayerId;

  /** Target IDs for the move */
  targets: CardId[];

  /** Priority level (higher = more important) */
  priority: number;

  /** Evaluation score (0-1, higher is better) */
  score?: number;
};

/**
 * Minimal game state required for move enumeration
 */
export type GameStateForEnumeration = {
  /** All card instances in the game */
  cards: CardInstance[];

  /** Current player */
  currentPlayer: PlayerId;

  /** Additional state fields games can add */
  [key: string]: unknown;
};

/**
 * Context for move enumeration (game-specific logic)
 */
export type MoveEnumerationContext = {
  /** List of available move names */
  availableMoves: string[];

  /** Check if a player can execute a move */
  canExecuteMove: (moveName: string, playerId?: PlayerId) => boolean;

  /** Get valid targets for a move */
  getTargetsForMove: (moveName: string) => CardId[];

  /** Optional: Get priority for a move type (default: based on order) */
  getMovePriority?: (moveName: string) => number;

  /** Optional: Score a move for AI evaluation */
  scoreMove?: (move: EnumeratedMove, state: GameStateForEnumeration) => number;
};

/**
 * Enumerates all valid moves for a player.
 *
 * @param state - Current game state
 * @param playerId - Player to enumerate moves for
 * @param context - Move enumeration context with game-specific logic
 * @returns Array of enumerated moves with targets and evaluation data
 *
 * @example
 * const context: MoveEnumerationContext = {
 *   availableMoves: ["playCard", "passTurn"],
 *   canExecuteMove: (moveName) => true,
 *   getTargetsForMove: (moveName) => {
 *     if (moveName === "playCard") {
 *       return getCardsInHand(state, playerId);
 *     }
 *     return [];
 *   }
 * };
 *
 * const moves = enumerateValidMoves(state, playerId, context);
 * // Returns all valid playCard moves (one per card) + passTurn move
 */
export function enumerateValidMoves(
  state: GameStateForEnumeration,
  playerId: PlayerId,
  context: MoveEnumerationContext,
): EnumeratedMove[] {
  const moves: EnumeratedMove[] = [];

  // Default priority based on order in availableMoves
  const defaultPriority = (moveName: string): number => {
    const index = context.availableMoves.indexOf(moveName);
    return context.availableMoves.length - index;
  };

  for (const moveName of context.availableMoves) {
    // Check if player can execute this move
    if (!context.canExecuteMove(moveName, playerId)) {
      continue;
    }

    // Get valid targets for this move
    const targets = context.getTargetsForMove(moveName);

    if (targets.length === 0) {
      // No targets needed - add single move
      const move: EnumeratedMove = {
        moveName,
        playerId,
        targets: [],
        priority:
          context.getMovePriority?.(moveName) ?? defaultPriority(moveName),
      };

      // Add score if scoring function provided
      if (context.scoreMove) {
        move.score = context.scoreMove(move, state);
      }

      moves.push(move);
    } else {
      // Create one move per target
      for (const target of targets) {
        const move: EnumeratedMove = {
          moveName,
          playerId,
          targets: [target],
          priority:
            context.getMovePriority?.(moveName) ?? defaultPriority(moveName),
        };

        // Add score if scoring function provided
        if (context.scoreMove) {
          move.score = context.scoreMove(move, state);
        }

        moves.push(move);
      }
    }
  }

  // Sort by priority (descending), then by score (descending)
  moves.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    if (a.score !== undefined && b.score !== undefined) {
      return b.score - a.score;
    }
    return 0;
  });

  return moves;
}

/**
 * Enumerates valid targets for a specific move.
 *
 * @param state - Current game state
 * @param moveName - Name of the move
 * @param context - Move enumeration context
 * @returns Array of valid target card IDs
 *
 * @example
 * const targets = enumerateValidTargets(state, "attackCreature", context);
 * // Returns IDs of all creatures that can be attacked
 */
export function enumerateValidTargets(
  state: GameStateForEnumeration,
  moveName: string,
  context: MoveEnumerationContext,
): CardId[] {
  // Check if move is available
  if (!context.availableMoves.includes(moveName)) {
    return [];
  }

  // Get targets from context
  return context.getTargetsForMove(moveName);
}

/**
 * Validates whether a move is legal in the current state.
 *
 * @param state - Current game state
 * @param move - Move to validate
 * @param context - Move enumeration context
 * @returns True if move is valid
 *
 * @example
 * const move: EnumeratedMove = {
 *   moveName: "playCard",
 *   playerId: player1,
 *   targets: [cardId],
 *   priority: 1
 * };
 *
 * if (isValidMove(state, move, context)) {
 *   // Execute the move
 * }
 */
export function isValidMove(
  state: GameStateForEnumeration,
  move: EnumeratedMove,
  context: MoveEnumerationContext,
): boolean {
  // Check if move is in available moves
  if (!context.availableMoves.includes(move.moveName)) {
    return false;
  }

  // Check if player can execute the move
  if (!context.canExecuteMove(move.moveName, move.playerId)) {
    return false;
  }

  // Check if targets are valid
  const validTargets = context.getTargetsForMove(move.moveName);

  // If move requires targets, validate them
  if (move.targets.length > 0) {
    for (const target of move.targets) {
      if (!validTargets.includes(target)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Counts valid moves without full enumeration (more efficient).
 *
 * @param state - Current game state
 * @param playerId - Player to count moves for
 * @param context - Move enumeration context
 * @returns Number of valid moves
 *
 * @example
 * const count = countValidMoves(state, playerId, context);
 * if (count === 0) {
 *   // Player has no valid moves
 * }
 */
export function countValidMoves(
  state: GameStateForEnumeration,
  playerId: PlayerId,
  context: MoveEnumerationContext,
): number {
  let count = 0;

  for (const moveName of context.availableMoves) {
    // Check if player can execute this move
    if (!context.canExecuteMove(moveName, playerId)) {
      continue;
    }

    // Get target count
    const targets = context.getTargetsForMove(moveName);

    if (targets.length === 0) {
      // No targets needed - count as 1 move
      count += 1;
    } else {
      // One move per target
      count += targets.length;
    }
  }

  return count;
}
