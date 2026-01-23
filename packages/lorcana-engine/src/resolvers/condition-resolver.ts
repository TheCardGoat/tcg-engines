import type { CardInstance, CardRegistry } from "@tcg/core";
import type { Condition } from "../cards/abilities/types/condition-types";
import type { LorcanaContext } from "../targeting/lorcana-target-dsl";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { LorcanaCardMeta, LorcanaGameState } from "../types/game-state";
import { conditionRegistry } from "./condition-registry";

const MAX_RECURSION_DEPTH = 10;

/**
 * Check if a condition is met
 */
export function isConditionMet(
  condition: Condition,
  sourceCard: CardInstance<LorcanaCardMeta>,
  state: LorcanaGameState,
  registry: CardRegistry<LorcanaCardDefinition>,
  context?: LorcanaContext,
): boolean {
  // Initialize context if needed
  const ctx = context ?? ({} as LorcanaContext);
  const depth = ctx.recursionDepth ?? 0;

  // 1. Recursion protection
  if (depth > MAX_RECURSION_DEPTH) {
    console.warn(
      `Max recursion depth ${MAX_RECURSION_DEPTH} reached evaluating condition for ${sourceCard.id}`,
    );
    return false; // Fail safe
  }

  // 2. Evaluation
  try {
    // Increment depth in context
    ctx.recursionDepth = depth + 1;

    // Get handler
    const handler = conditionRegistry.get(condition.type);
    if (!handler) {
      console.warn(`No handler found for condition type: ${condition.type}`);
      return false;
    }

    const result = handler.evaluate(condition, sourceCard, {
      state,
      registry,
      context: ctx,
    });

    return result;
  } catch (error) {
    console.warn("Error evaluating condition", error);
    return false;
  } finally {
    // Restore depth
    ctx.recursionDepth = depth;
  }
}

/**
 * Check if a list of conditions are ALL met (Implicit AND)
 */
export function areConditionsMet(
  conditions: Condition[] | undefined,
  sourceCard: CardInstance<LorcanaCardMeta>,
  state: LorcanaGameState,
  registry: CardRegistry<LorcanaCardDefinition>,
  context?: LorcanaContext,
): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  // Sort by complexity to fail fast
  const sorted = [...conditions].sort((a, b) => {
    const ha = conditionRegistry.get(a.type);
    const hb = conditionRegistry.get(b.type);
    const ca = ha ? ha.complexity : 100;
    const cb = hb ? hb.complexity : 100;
    return ca - cb;
  });

  return sorted.every((cond) =>
    isConditionMet(cond, sourceCard, state, registry, context),
  );
}
