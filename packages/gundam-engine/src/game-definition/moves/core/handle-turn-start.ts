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
import {
  detectStartOfTurnTriggers,
  orderTriggeredEffects,
} from "../../../effects/trigger-detection";
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
  enumerator: () => {
    // Internal move - not enumerable
    return [];
  },

  /**
   * Condition: Can execute if:
   * - Game is in valid state
   */
  condition: (_state: GundamGameState, _context: MoveContext): boolean => {
    return true;
  },

  /**
   * Reducer: Execute turn start logic
   *
   * Detects and enqueues start of turn triggered effects.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;

    // Detect start of turn triggered effects
    const triggerResult = detectStartOfTurnTriggers(draft, playerId);

    if (triggerResult.hasTriggers) {
      // Order effects: active player's effects first
      const orderResult = orderTriggeredEffects(
        triggerResult.effects,
        draft.currentPlayer,
      );

      // Enqueue effects in the determined order
      enqueueBatchEffects(draft, triggerResult.effects, orderResult.order);

      console.log(
        `[TURN_START] Detected ${triggerResult.effects.length} start of turn triggers for ${playerId}, enqueued in order: ${orderResult.order.join(", ")}`,
      );
    }
  },

  metadata: {
    category: "turn-management",
    tags: ["automatic", "trigger-detection"],
    description: "Handle turn start and detect triggered effects",
    canBeUndone: false,
    affectsZones: [],
  },
};
