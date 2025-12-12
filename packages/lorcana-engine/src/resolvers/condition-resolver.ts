import type { CardInstance, CardRegistry } from "@tcg/core";
import type { Condition } from "../cards/abilities/types/condition-types";
import type { LorcanaContext } from "../targeting/lorcana-target-dsl";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { LorcanaCardMeta, LorcanaGameState } from "../types/game-state";
import { conditionRegistry } from "./condition-registry";

// Cache for condition results
// WeakMap: State -> Map<CacheKey, boolean>
// CacheKey: `${conditionType}-${sourceId}-${JSON.stringify(condition)}`
const conditionCache = new WeakMap<LorcanaGameState, Map<string, boolean>>();

const MAX_RECURSION_DEPTH = 10;
let recursionDepth = 0;

/**
 * Get a unique key for caching the condition result
 */
function getConditionCacheKey(
  condition: Condition,
  sourceCard: CardInstance<LorcanaCardMeta>,
): string {
  // We use JSON.stringify for the condition.
  // For performance in hot paths, we might want a faster hash or ID if conditions had IDs.
  // Given conditions are often small objects, this is usually acceptable.
  return `${sourceCard.id}:${condition.type}:${JSON.stringify(condition)}`;
}

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
  // 1. Recursion protection
  if (recursionDepth > MAX_RECURSION_DEPTH) {
    console.warn(
      `Max recursion depth ${MAX_RECURSION_DEPTH} reached evaluating condition for ${sourceCard.id}`,
    );
    return false; // Fail safe
  }

  /*
  // 2. Cache Lookup
  let stateCache = conditionCache.get(state);
  if (!stateCache) {
    stateCache = new Map();
    conditionCache.set(state, stateCache);
  }

  const cacheKey = getConditionCacheKey(condition, sourceCard);
  const cachedResult = stateCache.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }
  */

  // 3. Evaluation
  try {
    recursionDepth++;

    // Get handler
    const handler = conditionRegistry.get(condition.type);
    if (!handler) {
      console.warn(`No handler found for condition type: ${condition.type}`);
      return false;
    }

    const result = handler.evaluate(condition, sourceCard, {
      state,
      registry,
      context,
    });

    // 4. Cache Result
    // stateCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("Error evaluating condition", error);
    return false;
  } finally {
    recursionDepth--;
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
