/**
 * Handle Turn End Move Implementation
 *
 * Handles turn end logic including:
 * - Detecting end of turn triggered effects
 * - Enqueuing detected effects onto the effect stack
 *
 * This move is typically auto-executed at the end of each turn.
 *
 * Rule References:
 * - Rule 11-2: Triggered effects activate when specific conditions occur
 * - Rule 6-1-3: Phases do not advance until all triggered effects resolve
 */

import type { GameMoveDefinition, MoveContext } from "@tcg/core";
import type { Draft } from "immer";
import { enqueueBatchEffects } from "../../../effects/effect-stack";
import {
  detectEndOfTurnTriggers,
  orderTriggeredEffects,
} from "../../../effects/trigger-detection";
import type { GundamGameState } from "../../../types";

/**
 * Handle Turn End Move Definition
 *
 * Processes end of turn triggered effects for the current player.
 * Note: End of turn effects trigger for ALL players, not just the current player.
 */
export const handleTurnEndMove: GameMoveDefinition<GundamGameState> = {
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
   * Reducer: Execute turn end logic
   *
   * Detects and enqueues end of turn triggered effects.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;

    // Detect end of turn triggered effects
    // Note: detectEndOfTurnTriggers scans all players' cards
    const triggerResult = detectEndOfTurnTriggers(draft, playerId);

    if (triggerResult.hasTriggers) {
      // Order effects: active player's effects first
      const orderResult = orderTriggeredEffects(
        triggerResult.effects,
        draft.currentPlayer,
      );

      // Enqueue effects in the determined order
      enqueueBatchEffects(
        draft,
        [...triggerResult.effects],
        [...orderResult.order],
      );

      console.log(
        `[TURN_END] Detected ${triggerResult.effects.length} end of turn triggers, enqueued in order: ${orderResult.order.join(", ")}`,
      );
    }
  },

  metadata: {
    category: "turn-management",
    tags: ["automatic", "trigger-detection"],
    description: "Handle turn end and detect triggered effects",
    canBeUndone: false,
    affectsZones: [],
  },
};
