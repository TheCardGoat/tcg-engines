import type { CardInstance, CardRegistry } from "@tcg/core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import type { LorcanaCardMeta, LorcanaGameState } from "../types/game-state";
import { filterRegistry, registerDefaultFilters } from "./filter-registry";
import type { LorcanaContext, LorcanaFilter } from "./lorcana-target-dsl";

// Initialize registry
registerDefaultFilters();

/**
 * Check if a card matches a Lorcana-specific filter using the registry
 */
export function matchesLorcanaFilter(
  card: CardInstance<LorcanaCardMeta>,
  filter: LorcanaFilter,
  state: LorcanaGameState,
  registry: CardRegistry<LorcanaCardDefinition>,
  context?: LorcanaContext,
): boolean {
  const handler = filterRegistry.get(filter.type);
  if (!handler) {
    console.warn(`No handler found for filter type: ${filter.type}`);
    return false;
  }

  return handler.evaluate(filter, card, { context, registry, state });
}

/**
 * Sort filters by rank using registry complexity
 */
export function sortFilters(filters: LorcanaFilter[]): LorcanaFilter[] {
  return [...filters].toSorted((a, b) => {
    const handlerA = filterRegistry.get(a.type);
    const handlerB = filterRegistry.get(b.type);
    const rankA = handlerA ? handlerA.complexity : 100;
    const rankB = handlerB ? handlerB.complexity : 100;
    return rankA - rankB;
  });
}

/**
 * Creates a predicate function that checks if a card matches all filters
 */
export function createTargetFiltersPredicate(
  filters: LorcanaFilter[] | undefined,
  state: LorcanaGameState,
  registry: CardRegistry<LorcanaCardDefinition>,
  context?: LorcanaContext,
): (card: CardInstance<LorcanaCardMeta>) => boolean {
  if (!filters || filters.length === 0) {
    return () => true;
  }

  const sortedFilters = sortFilters(filters);

  return (card: CardInstance<LorcanaCardMeta>) =>
    sortedFilters.every((filter) => matchesLorcanaFilter(card, filter, state, registry, context));
}

/**
 * Debug info for filter evaluation
 */
export interface FilterDebugInfo {
  filter: LorcanaFilter;
  passed: boolean;
  executionTime: number;
}

/**
 * Create a predicate with debug capabilities
 */
export function createTargetFiltersPredicateWithDebug(
  filters: LorcanaFilter[] | undefined,
  state: LorcanaGameState,
  registry: CardRegistry<LorcanaCardDefinition>,
  context?: LorcanaContext,
): {
  predicate: (card: CardInstance<LorcanaCardMeta>) => boolean;
  debug: (card: CardInstance<LorcanaCardMeta>) => {
    result: boolean;
    details: FilterDebugInfo[];
  };
} {
  const rawPredicate = createTargetFiltersPredicate(filters, state, registry, context);
  const sortedFilters = filters ? sortFilters(filters) : [];

  const debug = (card: CardInstance<LorcanaCardMeta>) => {
    const details: FilterDebugInfo[] = [];
    let result = true;

    for (const filter of sortedFilters) {
      const start = performance.now();
      const passed = matchesLorcanaFilter(card, filter, state, registry, context);
      const duration = performance.now() - start;

      details.push({
        executionTime: duration,
        filter,
        passed,
      });

      if (!passed) {
        result = false;
        break;
      }
    }

    return { details, result };
  };

  return { debug, predicate: rawPredicate };
}

/**
 * Validate filters configuration
 */
export function validateFilters(filters: LorcanaFilter[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  for (const f of filters) {
    const handler = filterRegistry.get(f.type);
    if (!handler) {
      errors.push(`Unknown filter type: ${f.type}`);
    }
    // TODO: Add specific handler validation if needed
  }
  return { errors, valid: errors.length === 0 };
}
