/**
 * Execute Effect Move Implementation
 *
 * Implements the unified dispatcher for all effect actions.
 * Handles:
 * - Loading effect instance and definition
 * - Dispatching actions to appropriate handlers
 * - Atomic execution of all actions in an effect
 * - Tracking current action index during execution
 * - Marking effects as resolved when complete
 *
 * Rule References:
 * - Rule 11-3-3: All actions in an effect execute atomically
 * - Rule 11-3-4: Actions resolve in the order listed on the card
 */

import type { CardId, GameMoveDefinition, MoveContext } from "@tcg/core";
import type { Draft } from "immer";
import { executeAction } from "../../../effects/action-handlers";
import {
  findEffectInstance,
  getEffectDefinition,
  markEffectResolving,
} from "../../../effects/effect-stack";
import type { GundamGameState } from "../../../types";
import type { EffectAction } from "../../../types/effects";

/**
 * Extracts and validates effect instance ID from move context
 */
function getEffectInstanceId(context: MoveContext): string {
  const effectInstanceId = context.params?.effectInstanceId;

  if (!effectInstanceId || typeof effectInstanceId !== "string") {
    throw new Error(`Invalid effect instance ID: ${effectInstanceId}`);
  }

  return effectInstanceId;
}

/**
 * Extracts targets from move context (optional)
 */
function getTargets(context: MoveContext): CardId[] | undefined {
  const targets = context.params?.targets;

  if (targets === undefined || targets === null) {
    return undefined;
  }

  if (!Array.isArray(targets)) {
    return undefined;
  }

  return targets as CardId[];
}

/**
 * Execute Effect Move Definition
 *
 * Unified dispatcher for all effect actions.
 * This is an internal move called by resolveEffectStack.
 */
export const executeEffectMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Enumerator: Not enumerable (internal move)
   *
   * This move is called internally by resolveEffectStack,
   * not directly by players.
   */
  enumerator: () => {
    // Internal move - not enumerable
    return [];
  },

  /**
   * Condition: Can execute if:
   * - Effect instance exists
   * - Effect is in "pending" or "resolving" state
   */
  condition: (state: GundamGameState, context: MoveContext): boolean => {
    // Get effect instance ID
    let effectInstanceId: string;
    try {
      effectInstanceId = getEffectInstanceId(context);
    } catch {
      return false;
    }

    // Find effect instance
    const instance = findEffectInstance(state, effectInstanceId);
    if (!instance) return false;

    // Check effect state
    if (instance.state !== "pending" && instance.state !== "resolving") {
      return false;
    }

    // Stub target validation for now (T5 will implement real validation)
    return true;
  },

  /**
   * Reducer: Execute effect actions
   *
   * Loads effect definition and dispatches each action to its handler.
   * All actions execute atomically without intermediate state checks.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;
    const effectInstanceId = getEffectInstanceId(context);
    const targets = getTargets(context);

    // Load effect instance
    const instance = findEffectInstance(draft, effectInstanceId);
    if (!instance) {
      throw new Error(`Effect instance ${effectInstanceId} not found`);
    }

    const { sourceCardId, controllerId, effectRef } = instance;

    // Mark effect as resolving
    markEffectResolving(draft, effectInstanceId);

    // Load effect definition from source card
    const effectDefinition = getEffectDefinition(
      draft,
      sourceCardId,
      effectRef.effectId,
    );

    if (!effectDefinition) {
      // Effect definition not found - this could happen if:
      // 1. The effect ID is invalid
      // 2. The effect definition hasn't been registered yet
      // For T4, we'll use an empty actions array
      console.warn(
        `[EXECUTE_EFFECT] Effect definition not found for card ${sourceCardId}, effect ${effectRef.effectId}`,
      );
    }

    const actions = effectDefinition?.actions ?? [];

    // Execute each action in order
    for (const action of actions) {
      // Create action context
      const actionContext = {
        sourceCardId,
        controllerId,
        targets,
      };

      // Dispatch action by type
      executeAction(draft, action, actionContext);

      // Advance current action index
      const updatedInstance = findEffectInstance(draft, effectInstanceId);
      if (updatedInstance) {
        (
          updatedInstance as { currentActionIndex: number }
        ).currentActionIndex += 1;
      }
    }

    // When all actions complete, mark as resolved
    // This is handled by resolveEffectStack, not here
    // We just execute the actions atomically

    console.log(
      `[EXECUTE_EFFECT] Executed ${actions.length} actions for effect ${effectInstanceId}`,
    );
  },

  metadata: {
    category: "effect-execution",
    tags: ["internal"],
    description: "Execute effect actions",
    canBeUndone: false,
    affectsZones: [],
  },
};
