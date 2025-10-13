/**
 * History Operations
 *
 * Operations API exposed to move reducers via MoveContext.
 * Allows moves to log custom history entries with player-specific visibility.
 */

import type { HistoryManager } from "./history-manager";
import type { HistoryMessages } from "./types";

/**
 * History Operations
 *
 * API for logging history entries from within move reducers.
 *
 * @example
 * ```typescript
 * // In a move reducer
 * reducer: (draft, context) => {
 *   // Log a public message
 *   context.history.log({
 *     messages: {
 *       visibility: 'PUBLIC',
 *       messages: {
 *         casual: { key: 'moves.draw', values: { count: 5 } },
 *         advanced: { key: 'moves.draw.detailed', values: { cardIds: [...] } }
 *       }
 *     }
 *   });
 *
 *   // Log a player-specific message (mulligan)
 *   context.history.log({
 *     messages: {
 *       visibility: 'PLAYER_SPECIFIC',
 *       messages: {
 *         [playerId]: {
 *           casual: { key: 'mulligan.self', values: { cards: [...] } }
 *         },
 *         [opponentId]: {
 *           casual: { key: 'mulligan.opponent', values: { count: 3 } }
 *         }
 *       }
 *     }
 *   });
 * }
 * ```
 */
export type HistoryOperations = {
  /**
   * Log a custom history entry
   *
   * Creates a history entry with custom messages.
   * Used by move reducers to add detailed logging beyond the automatic entry.
   *
   * Note: The engine automatically creates a base history entry for each move.
   * Use this method to add additional context or player-specific details.
   *
   * @param input - Message templates and metadata
   *
   * @example
   * ```typescript
   * // Log card draw with player-specific visibility
   * context.history.log({
   *   messages: {
   *     visibility: 'PLAYER_SPECIFIC',
   *     messages: {
   *       [playerId]: {
   *         casual: { key: 'draw.self', values: { cards: ['Knight', 'Wizard'] } }
   *       },
   *       [opponentId]: {
   *         casual: { key: 'draw.opponent', values: { count: 2 } }
   *       }
   *     }
   *   }
   * });
   * ```
   */
  log(input: {
    messages: HistoryMessages;
    metadata?: Record<string, unknown>;
  }): void;
};

/**
 * Create History Operations
 *
 * Factory for creating HistoryOperations bound to a specific context.
 *
 * @param manager - History manager instance
 * @param context - Move execution context
 * @returns History operations API
 */
export function createHistoryOperations(
  manager: HistoryManager,
  context: {
    moveId: string;
    playerId: string;
    params: unknown;
    timestamp: number;
    turn?: number;
    phase?: string;
    segment?: string;
  },
): HistoryOperations {
  return {
    log(input) {
      manager.addEntry({
        moveId: context.moveId,
        playerId: context.playerId as any,
        params: context.params,
        timestamp: context.timestamp,
        turn: context.turn,
        phase: context.phase,
        segment: context.segment,
        success: true,
        messages: input.messages,
        metadata: input.metadata,
      });
    },
  };
}
