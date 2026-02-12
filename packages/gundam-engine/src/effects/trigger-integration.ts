/**
 * Trigger Integration Helpers
 *
 * Helper functions for integrating trigger detection with game moves.
 * These functions provide a convenient way to detect and enqueue triggered
 * effects from within move reducers.
 *
 * @module effects/trigger-integration
 */

import type { CardId, PlayerId } from "@tcg/core";
import type { GundamGameState } from "../types";
import { enqueueBatchEffects } from "./effect-stack";
import {
  detectAttackTriggers,
  detectDeployTriggers,
  detectDestroyedTriggers,
  detectEndOfTurnTriggers,
  detectStartOfTurnTriggers,
  orderTriggeredEffects,
} from "./trigger-detection";

// ============================================================================
// DEPLOY TRIGGER INTEGRATION
// ============================================================================

/**
 * Detect and enqueue deploy triggers
 *
 * Called after a unit is deployed to detect and enqueue any
 * 【Deploy】 triggered effects.
 *
 * @param draft - Immer draft state
 * @param deployedCardId - ID of the deployed unit
 * @param deployingPlayerId - Player who deployed the unit
 *
 * @example
 * ```typescript
 * // In a move reducer after deploying a unit:
 * detectAndEnqueueDeployTriggers(draft, cardId, playerId);
 * ```
 */
export function detectAndEnqueueDeployTriggers(
  draft: GundamGameState,
  deployedCardId: CardId,
  deployingPlayerId: PlayerId,
): void {
  const triggerResult = detectDeployTriggers(draft, deployedCardId, deployingPlayerId);

  if (triggerResult.hasTriggers) {
    // Order effects: active player's effects first
    const orderResult = orderTriggeredEffects(triggerResult.effects, draft.currentPlayer);

    // Enqueue effects in the determined order
    enqueueBatchEffects(draft, [...triggerResult.effects], [...orderResult.order]);

    console.log(
      `[DEPLOY] Detected ${triggerResult.effects.length} deploy triggers for ${deployedCardId}, enqueued in order: ${orderResult.order.join(", ")}`,
    );
  }
}

// ============================================================================
// ATTACK TRIGGER INTEGRATION
// ============================================================================

/**
 * Detect and enqueue attack triggers
 *
 * Called after a unit attacks to detect and enqueue any
 * 【Attack】 triggered effects.
 *
 * @param draft - Immer draft state
 * @param attackerId - ID of the attacking unit
 * @param targetId - ID of the target (if any)
 * @param attackingPlayerId - Player controlling the attacker
 *
 * @example
 * ```typescript
 * // In a move reducer after attacking:
 * detectAndEnqueueAttackTriggers(draft, attackerId, targetId, playerId);
 * ```
 */
export function detectAndEnqueueAttackTriggers(
  draft: GundamGameState,
  attackerId: CardId,
  targetId: CardId | undefined,
  attackingPlayerId: PlayerId,
): void {
  const triggerResult = detectAttackTriggers(draft, attackerId, targetId, attackingPlayerId);

  if (triggerResult.hasTriggers) {
    // Order effects: active player's effects first
    const orderResult = orderTriggeredEffects(triggerResult.effects, draft.currentPlayer);

    // Enqueue effects in the determined order
    enqueueBatchEffects(draft, [...triggerResult.effects], [...orderResult.order]);

    console.log(
      `[ATTACK] Detected ${triggerResult.effects.length} attack triggers, enqueued in order: ${orderResult.order.join(", ")}`,
    );
  }
}

// ============================================================================
// DESTROYED TRIGGER INTEGRATION
// ============================================================================

/**
 * Detect and enqueue destroyed triggers
 *
 * Called after a card is destroyed to detect and enqueue any
 * 【Destroyed】 triggered effects.
 *
 * @param draft - Immer draft state
 * @param destroyedCardId - ID of the destroyed card
 * @param ownerPlayerId - Player who owned the destroyed card
 *
 * @example
 * ```typescript
 * // In a move reducer after destroying a card:
 * detectAndEnqueueDestroyedTriggers(draft, cardId, playerId);
 * ```
 */
export function detectAndEnqueueDestroyedTriggers(
  draft: GundamGameState,
  destroyedCardId: CardId,
  ownerPlayerId: PlayerId,
): void {
  const triggerResult = detectDestroyedTriggers(draft, destroyedCardId, ownerPlayerId);

  if (triggerResult.hasTriggers) {
    // Order effects: active player's effects first
    const orderResult = orderTriggeredEffects(triggerResult.effects, draft.currentPlayer);

    // Enqueue effects in the determined order
    enqueueBatchEffects(draft, [...triggerResult.effects], [...orderResult.order]);

    console.log(
      `[DESTROYED] Detected ${triggerResult.effects.length} destroyed triggers for ${destroyedCardId}, enqueued in order: ${orderResult.order.join(", ")}`,
    );
  }
}

// ============================================================================
// TURN TRIGGER INTEGRATION
// ============================================================================

/**
 * Detect and enqueue start of turn triggers
 *
 * Called at the start of a player's turn to detect and enqueue any
 * start of turn triggered effects.
 *
 * @param draft - Immer draft state
 * @param playerId - Player whose turn is starting
 *
 * @example
 * ```typescript
 * // In a move reducer at turn start:
 * detectAndEnqueueStartOfTurnTriggers(draft, playerId);
 * ```
 */
export function detectAndEnqueueStartOfTurnTriggers(
  draft: GundamGameState,
  playerId: PlayerId,
): void {
  const triggerResult = detectStartOfTurnTriggers(draft, playerId);

  if (triggerResult.hasTriggers) {
    // Order effects: active player's effects first
    const orderResult = orderTriggeredEffects(triggerResult.effects, draft.currentPlayer);

    // Enqueue effects in the determined order
    enqueueBatchEffects(draft, [...triggerResult.effects], [...orderResult.order]);

    console.log(
      `[TURN_START] Detected ${triggerResult.effects.length} start of turn triggers for ${playerId}, enqueued in order: ${orderResult.order.join(", ")}`,
    );
  }
}

/**
 * Detect and enqueue end of turn triggers
 *
 * Called at the end of a player's turn to detect and enqueue any
 * end of turn triggered effects.
 *
 * @param draft - Immer draft state
 * @param playerId - Player whose turn is ending
 *
 * @example
 * ```typescript
 * // In a move reducer at turn end:
 * detectAndEnqueueEndOfTurnTriggers(draft, playerId);
 * ```
 */
export function detectAndEnqueueEndOfTurnTriggers(
  draft: GundamGameState,
  playerId: PlayerId,
): void {
  const triggerResult = detectEndOfTurnTriggers(draft, playerId);

  if (triggerResult.hasTriggers) {
    // Order effects: active player's effects first
    const orderResult = orderTriggeredEffects(triggerResult.effects, draft.currentPlayer);

    // Enqueue effects in the determined order
    enqueueBatchEffects(draft, [...triggerResult.effects], [...orderResult.order]);

    console.log(
      `[TURN_END] Detected ${triggerResult.effects.length} end of turn triggers, enqueued in order: ${orderResult.order.join(", ")}`,
    );
  }
}
