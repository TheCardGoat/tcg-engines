/**
 * Handle Turn Start Move Implementation
 *
 * Handles turn start logic including:
 * - Detecting start of turn triggered effects
 * - Enqueuing detected effects onto the effect stack
 *
 * This move is typically auto-executed at the beginning of each turn.
 *
 * Rule References:
 * - Rule 11-2: Triggered effects activate when specific conditions occur
 * - Rule 6-1-3: Phases do not advance until all triggered effects resolve
 */

import type { GameMoveDefinition, MoveContext } from "@tcg/core";
import type { Draft } from "immer";
import { enqueueBatchEffects } from "../../../effects/effect-stack";
import { detectAndEnqueueStartOfTurnTriggers } from "../../../effects/trigger-integration";
import type { GundamGameState } from "../../../types";

/**
 * Handle Turn Start Move Definition
 *
 * Processes start of turn triggered effects for the current player.
 */
export const handleTurnStartMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Enumerator: Not enumerable (internal move)
   *
   * This move is called internally by game flow.
   */
  enumerator: () => [],

  /**
   * Condition: Can execute if:
   * - Game is in valid state
   */
  condition: (_state: GundamGameState, _context: MoveContext): boolean => true,

  /**
   * Reducer: Execute turn start logic
   *
   * Detects and enqueues start of turn triggered effects.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;

    // Detect and enqueue start of turn triggered effects
    detectAndEnqueueStartOfTurnTriggers(draft, playerId);
  },

  metadata: {
    affectsZones: [],
    canBeUndone: false,
    category: "turn-management",
    description: "Handle turn start and detect triggered effects",
    tags: ["automatic", "trigger-detection"],
  },
};
