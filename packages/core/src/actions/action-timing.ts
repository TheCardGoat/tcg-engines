import type { CardDefinition } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import type { CardRegistry } from "../operations/card-registry";
import { type TargetContext, validateTargetSelection } from "../targeting/target-validation";
import type { ActionDefinition, ActionInstance, ActionValidationResult } from "./action-definition";

/**
 * Game State Context for Timing Validation
 *
 * This is the minimal state information needed to validate action timing.
 * Games using core-engine will have their full state here, but we only
 * require the flow control properties.
 */
export interface TimingContext {
  /** Current segment in the game flow */
  currentSegment?: string | null;

  /** Current phase within the segment */
  currentPhase?: string | null;

  /** Current step within the phase */
  currentStep?: string | null;
}

/**
 * Validate Action Timing
 *
 * Checks if an action can be performed based on current game flow state.
 * This validates segments/phases/steps and custom timing predicates.
 *
 * Does NOT validate:
 * - Costs (handled by core-engine's getConstraints)
 * - Game-specific rules (handled by core-engine's getConstraints)
 * - Complex state conditions (handled by core-engine's getConstraints)
 *
 * @param action - The action definition
 * @param timingContext - Current game flow state (segment/phase/step)
 * @param gameState - Full game state for custom timing predicates
 * @returns True if timing is valid
 */
export function validateActionTiming<TGameState extends TimingContext>(
  action: ActionDefinition<TGameState>,
  timingContext: TimingContext,
  gameState?: TGameState,
): boolean {
  const { timing } = action;

  // No timing restrictions means action is always valid (timing-wise)
  if (!timing) {
    return true;
  }

  // Check segment restrictions
  if (timing.segments && timing.segments.length > 0) {
    if (!(timingContext.currentSegment && timing.segments.includes(timingContext.currentSegment))) {
      return false;
    }
  }

  // Check phase restrictions
  if (timing.phases && timing.phases.length > 0) {
    if (!(timingContext.currentPhase && timing.phases.includes(timingContext.currentPhase))) {
      return false;
    }
  }

  // Check step restrictions
  if (timing.steps && timing.steps.length > 0) {
    if (!(timingContext.currentStep && timing.steps.includes(timingContext.currentStep))) {
      return false;
    }
  }

  // Check custom timing predicate
  if (timing.custom && gameState) {
    return timing.custom(gameState);
  }

  return true;
}

/**
 * Validate Action Instance
 *
 * Validates both timing and target selection for an action instance.
 * This bridges @tcg/core's validation with core-engine's execution.
 *
 * @param instance - The action instance to validate
 * @param definition - The action definition
 * @param timingContext - Current game flow state
 * @param state - Full game state with card information
 * @param registry - Card definition registry for target validation
 * @returns Validation result
 */
export function validateAction<
  TCustomState = unknown,
  TGameState extends TimingContext & {
    cards: Record<string, CardInstance<TCustomState>>;
  } = {
    cards: Record<string, CardInstance<TCustomState>>;
  } & TimingContext,
>(
  instance: ActionInstance,
  definition: ActionDefinition<TGameState>,
  timingContext: TimingContext,
  state: TGameState,
  registry: CardRegistry<CardDefinition>,
): ActionValidationResult {
  // Validate timing
  const timingValid = validateActionTiming(definition, timingContext, state);
  if (!timingValid) {
    return {
      error: "Action cannot be performed at this time",
      reason: "timing",
      valid: false,
    };
  }

  // Validate targets if action requires them
  if (definition.targets && definition.targets.length > 0) {
    if (!instance.targets || instance.targets.length === 0) {
      return {
        error: "Action requires targets but none were provided",
        invalidTargets: [],
        reason: "targets",
        valid: false,
      };
    }

    // Validate each target group
    for (let i = 0; i < definition.targets.length; i++) {
      const targetDef = definition.targets[i];
      const selectedTargets = instance.targets[i] || [];

      // Convert target IDs to CardInstances
      const targetCards = selectedTargets
        .map((targetId) => state.cards[targetId])
        .filter((card) => card !== undefined);

      if (targetCards.length !== selectedTargets.length) {
        return {
          error: `Some target cards at index ${i} do not exist in game state`,
          invalidTargets: [i],
          reason: "targets",
          valid: false,
        };
      }

      // Create minimal target context for validation
      // Note: We don't have a source card concept in actions, so we use the player
      const context: Omit<TargetContext<TCustomState>, "previousTargets"> = {
        controller: instance.playerId,
        sourceCard: {
          controller: instance.playerId,
          id: "" as any,
          owner: instance.playerId,
        } as any,
      };

      // Validate target selection using @tcg/core's targeting system
      if (!targetDef) {
        return {
          error: `Target definition at index ${i} is undefined`,
          invalidTargets: [i],
          reason: "targets",
          valid: false,
        };
      }

      const validationResult = validateTargetSelection(
        targetCards,
        targetDef,
        state,
        registry,
        context,
      );

      if (!validationResult.valid) {
        return {
          error: `Invalid targets at index ${i}: ${validationResult.error}`,
          invalidTargets: [i],
          reason: "targets",
          valid: false,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Get Available Actions
 *
 * Filters a list of action definitions to only those that are valid
 * for the current timing context.
 *
 * This is useful for UI to show only valid actions, or for AI to
 * enumerate possible actions.
 *
 * @param actions - All possible action definitions
 * @param timingContext - Current game flow state
 * @param gameState - Full game state for custom timing predicates
 * @returns Array of actions that can be performed now (timing-wise)
 */
export function getAvailableActions<TGameState extends TimingContext>(
  actions: ActionDefinition<TGameState>[],
  timingContext: TimingContext,
  gameState?: TGameState,
): ActionDefinition<TGameState>[] {
  return actions.filter((action) => validateActionTiming(action, timingContext, gameState));
}

/**
 * Check if any action is available
 *
 * Quick check to see if the player has any valid actions.
 * More efficient than getAvailableActions when you only need a boolean.
 *
 * @param actions - All possible action definitions
 * @param timingContext - Current game flow state
 * @param gameState - Full game state for custom timing predicates
 * @returns True if at least one action can be performed
 */
export function hasAvailableActions<TGameState extends TimingContext>(
  actions: ActionDefinition<TGameState>[],
  timingContext: TimingContext,
  gameState?: TGameState,
): boolean {
  return actions.some((action) => validateActionTiming(action, timingContext, gameState));
}
