/**
 * Resolve Effect Stack Move Implementation
 *
 * Implements resolving the next effect from the effect stack.
 * Handles:
 * - Validation that stack has effects to resolve
 * - Peeking at the next effect
 * - Validating source card still exists
 * - Handling fizzled effects (source card destroyed)
 * - Target validation before execution
 * - Dispatching to executeEffectMove for unified execution
 * - Moving COMMAND cards from limbo to trash after resolution
 * - Popping resolved effects from the stack
 *
 * Rule References:
 * - Rule 11-3: Effects resolve in FIFO (First-In, First-Out) order
 * - Rule 11-3-1: If all targets become invalid, effect fizzles
 * - Rule 11-3-2: COMMAND cards move to trash after effect resolves
 */

import type { CardId, GameMoveDefinition, MoveContext } from "@tcg/core";
import { isCardInZone } from "@tcg/core";
import type { Draft } from "immer";
import { findCardZone } from "../../../effects/action-handlers";
import {
  dequeueEffect,
  findEffectInstance,
  getEffectDefinition,
  isEffectStackEmpty,
  markEffectFizzled,
  markEffectResolved,
  markEffectResolving,
  peekNextEffect,
  updateEffectInstance,
} from "../../../effects/effect-stack";
import type { GundamGameState } from "../../../types";
import type { EffectAction, TargetingSpec } from "../../../types/effects";
import { executeEffectMove } from "./execute-effect";

/**
 * Target Validation Result
 *
 * Result of target validation for effect execution.
 */
interface TargetValidationResult {
  /** Whether targets are valid */
  valid: boolean;
  /** Reason for invalid targets (when valid is false) */
  reason?: string;
}

/**
 * Validates targets for effect execution
 *
 * Analyzes effect actions for target-requiring actions and verifies:
 * - Target count matches minimum required
 * - Each target exists in the game state
 * - Targets satisfy effect filters (if applicable)
 *
 * @param draft - Immer draft state
 * @param actions - Effect actions to analyze
 * @param targets - Pre-resolved target card IDs
 * @param controllerId - Player controlling the effect
 * @returns Validation result
 */
function validateTargets(
  draft: GundamGameState,
  actions: EffectAction[],
  targets: CardId[],
  controllerId: string,
): TargetValidationResult {
  // Determine minimum required target count from actions
  let minRequiredTargets = 0;

  for (const action of actions) {
    const targetingSpec = extractTargetingSpec(action);
    if (targetingSpec) {
      const { count } = targetingSpec;
      if (typeof count === "number") {
        minRequiredTargets = Math.max(minRequiredTargets, count);
      } else {
        // TargetCountRange has min/max
        minRequiredTargets = Math.max(minRequiredTargets, count.min);
      }
    }
  }

  // If no targets required, validation passes
  if (minRequiredTargets === 0) {
    return { valid: true };
  }

  // Check target count
  if (targets.length < minRequiredTargets) {
    return {
      reason: `Insufficient targets: ${targets.length} provided, ${minRequiredTargets} required`,
      valid: false,
    };
  }

  // Validate each target exists
  for (const targetId of targets) {
    const zoneInfo = findCardZone(targetId, draft);
    if (!zoneInfo) {
      return {
        reason: `Target ${targetId} not found in any zone`,
        valid: false,
      };
    }
  }

  // Additional filter validation would go here in T5
  // For T4, we do basic existence checks

  return { valid: true };
}

/**
 * Extracts targeting spec from an effect action
 *
 * Returns the targeting spec if the action requires targets,
 * otherwise returns null.
 *
 * @param action - Effect action to analyze
 * @returns Targeting spec or null
 */
function extractTargetingSpec(action: EffectAction): TargetingSpec | null {
  switch (action.type) {
    case "DAMAGE": {
      // DAMAGE actions have implicit targeting
      return null;
    }
    case "REST":
    case "ACTIVATE":
    case "DESTROY":
    case "MOVE_CARD":
    case "MODIFY_STATS":
    case "GRANT_KEYWORD": {
      return action.target;
    }
    case "DRAW":
    case "DISCARD":
    case "SEARCH": {
      // These don't use target spec for card targets
      return null;
    }
    default: {
      return null;
    }
  }
}

/**
 * Resolve Effect Stack Move Definition
 *
 * Resolves the next effect from the effect stack.
 * This move is typically auto-executed by game flow.
 */
export const resolveEffectStackMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Enumerator: Generate effect resolution options
   *
   * Returns empty array if stack is empty, single option otherwise.
   * This move is typically auto-executed rather than user-triggered.
   */
  enumerator: (state: GundamGameState, context) => {
    // If stack is empty, no moves available
    if (isEffectStackEmpty(state)) {
      return [];
    }

    // If stack has effects, return single option (no params needed)
    return [{}];
  },

  /**
   * Condition: Can resolve if:
   * - Effect stack is not empty
   * - It's appropriate timing (not during other move execution)
   */
  condition: (state: GundamGameState, context: MoveContext): boolean => {
    // Stack must not be empty
    if (isEffectStackEmpty(state)) {
      return false;
    }

    return true;
  },

  /**
   * Reducer: Execute effect resolution
   *
   * Peeks at next effect, validates source card, validates targets,
   * dispatches to executeEffectMove, marks effect as resolved, and pops from stack.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;

    // Peek at next effect
    const nextEffect = peekNextEffect(draft);
    if (!nextEffect) {
      throw new Error("No effect to resolve");
    }

    const { instanceId, sourceCardId, controllerId } = nextEffect;

    // Validate effect source card still exists
    // Check all zones for the source card
    let sourceCardExists = false;
    let sourceCardZone: keyof typeof draft.zones | null = null;
    let sourceCardOwner: typeof playerId | null = null;

    for (const player of draft.players) {
      for (const zoneType of [
        "hand",
        "battleArea",
        "limbo",
        "trash",
        "removal",
        "shieldSection",
        "baseSection",
        "resourceArea",
      ] as const) {
        const zone = draft.zones[zoneType][player];
        if (zone && isCardInZone(zone, sourceCardId)) {
          sourceCardExists = true;
          sourceCardZone = zoneType;
          sourceCardOwner = player;
          break;
        }
      }
      if (sourceCardExists) {
        break;
      }
    }

    // If source card missing, mark effect as fizzled and pop
    if (!sourceCardExists) {
      markEffectFizzled(draft, instanceId);
      dequeueEffect(draft);
      return;
    }

    // Extract targets from context params (if provided)
    const targets = context.params?.targets as CardId[] | undefined;

    // Persist targets onto the effect instance
    const instance = findEffectInstance(draft, instanceId);
    if (instance && targets !== undefined) {
      updateEffectInstance(draft, instanceId, { targets });
    }

    // Load effect definition from source card
    const effectDefinition = getEffectDefinition(
      draft,
      sourceCardId,
      nextEffect.effectRef.effectId,
    );

    if (!effectDefinition) {
      // Effect definition not found
      console.warn(
        `[RESOLVE_EFFECT_STACK] Effect definition not found for card ${sourceCardId}, effect ${nextEffect.effectRef.effectId}`,
      );
    }

    const actions = effectDefinition?.actions ?? [];

    // Target validation: Analyze actions for target-requiring actions
    // And verify targets exist and satisfy effect filters
    const targetsValidationResult = validateTargets(draft, actions, targets ?? [], controllerId);

    if (!targetsValidationResult.valid) {
      // Invalid or missing required targets - fizzle effect
      console.warn(
        `[RESOLVE_EFFECT_STACK] Effect ${instanceId} fizzled: ${targetsValidationResult.reason}`,
      );
      markEffectFizzled(draft, instanceId);
      dequeueEffect(draft);
      return;
    }

    // Mark effect as resolving
    markEffectResolving(draft, instanceId);

    // Execute effect actions using executeEffectMove's reducer
    // Create internal move context for executeEffectMove
    const executeContext: MoveContext = {
      ...context,
      params: {
        effectInstanceId: instanceId,
        targets,
      },
    };

    // Dispatch to executeEffectMove's reducer for unified execution
    executeEffectMove.reducer(draft, executeContext);

    console.log(
      `[RESOLVE_EFFECT_STACK] Executed ${actions.length} actions for effect ${instanceId}`,
    );

    // Mark effect as resolved
    markEffectResolved(draft, instanceId);

    // Pop effect from stack
    dequeueEffect(draft);

    // If COMMAND card in limbo, move to trash after resolution
    if (sourceCardZone === "limbo" && sourceCardOwner) {
      const limbo = draft.zones.limbo[sourceCardOwner];
      const trash = draft.zones.trash[sourceCardOwner];

      if (limbo && trash && isCardInZone(limbo, sourceCardId)) {
        // Remove from limbo
        const cardIndex = limbo.cards.indexOf(sourceCardId);
        if (cardIndex !== -1) {
          limbo.cards.splice(cardIndex, 1);
        }

        // Add to trash
        trash.cards.push(sourceCardId);
      }
    }
  },

  metadata: {
    affectsZones: ["limbo", "trash"],
    canBeUndone: false,
    category: "effect-resolution",
    description: "Resolve next effect from stack",
    tags: ["automatic"],
  },
};
