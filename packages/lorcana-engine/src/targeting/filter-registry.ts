import type { CardInstance, CardRegistry } from "@tcg/core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import type { LorcanaCardMeta, LorcanaGameState } from "../types/game-state";
import type { LorcanaContext, LorcanaFilter } from "./lorcana-target-dsl";

/**
 * Filter evaluation context
 */
export interface FilterContext {
  state: LorcanaGameState;
  registry: CardRegistry<LorcanaCardDefinition>;
  context?: LorcanaContext;
}

/**
 * Handler for a specific filter type
 */
export interface FilterHandler<T extends LorcanaFilter = LorcanaFilter> {
  name: T["type"];
  complexity: number;
  evaluate: (filter: T, card: CardInstance<LorcanaCardMeta>, context: FilterContext) => boolean;
}

export class FilterRegistry {
  private handlers = new Map<string, FilterHandler>();

  /**
   * Register a filter handler
   */
  register<T extends LorcanaFilter>(handler: FilterHandler<T>): void {
    this.handlers.set(handler.name, handler as unknown as FilterHandler);
  }

  /**
   * Get a handler for a filter type
   */
  get(type: string): FilterHandler | undefined {
    return this.handlers.get(type);
  }

  /**
   * Get all registered handlers
   */
  getAll(): FilterHandler[] {
    return [...this.handlers.values()];
  }
}

// Global registry instance
export const filterRegistry = new FilterRegistry();

export function registerDefaultFilters() {
  // --- State Filters ---
  filterRegistry.register<LorcanaFilter & { type: "damaged" }>({
    complexity: 0,
    evaluate: (_, card) => (card.damage ?? 0) > 0,
    name: "damaged",
  });

  filterRegistry.register<LorcanaFilter & { type: "undamaged" }>({
    complexity: 0,
    evaluate: (_, card) => (card.damage ?? 0) === 0,
    name: "undamaged",
  });

  filterRegistry.register<LorcanaFilter & { type: "exerted" }>({
    complexity: 0,
    evaluate: (_, card) => card.state === "exerted",
    name: "exerted",
  });

  filterRegistry.register<LorcanaFilter & { type: "ready" }>({
    complexity: 0,
    evaluate: (_, card) => card.state === "ready",
    name: "ready",
  });

  filterRegistry.register<LorcanaFilter & { type: "dry" }>({
    complexity: 0,
    evaluate: (_, card) => !(card.isDrying ?? false),
    name: "dry",
  });

  filterRegistry.register<LorcanaFilter & { type: "inkable"; value: boolean }>({
    complexity: 0,
    evaluate: (filter, card, { registry }) => {
      const def = registry.getCard(card.definitionId);
      return def ? def.inkable === filter.value : false;
    },
    name: "inkable",
  });

  // --- Property Filters ---
  filterRegistry.register<LorcanaFilter & { type: "has-keyword"; keyword: any }>({
    complexity: 10,
    evaluate: (filter, card, { registry }) => {
      const def = registry.getCard(card.definitionId);
      return (
        def?.abilities?.some((a: any) => a.type === "keyword" && a.keyword === filter.keyword) ??
        false
      );
    },
    name: "has-keyword",
  });

  filterRegistry.register<LorcanaFilter & { type: "has-classification"; classification: string }>({
    complexity: 10,
    evaluate: (filter, card, { registry }) => {
      const def = registry.getCard(card.definitionId);
      if (!def || def.cardType !== "character") {return false;}
      return (
        def.classifications?.some(
          (c: string) => c.toLowerCase() === filter.classification.toLowerCase(),
        ) ?? false
      );
    },
    name: "has-classification",
  });

  filterRegistry.register<
    LorcanaFilter & { type: "name" } & ({ equals: string } | { contains: string })
  >({
    complexity: 10,
    evaluate: (filter, card, { registry }) => {
      const def = registry.getCard(card.definitionId);
      if (!def) {return false;}
      if ("equals" in filter) {
        return def.name === filter.equals;
      }
      if ("contains" in filter) {
        return def.name.includes(filter.contains);
      }
      return false;
    },
    name: "name",
  });

  filterRegistry.register<LorcanaFilter & { type: "card-type"; value: any }>({
    complexity: 5,
    evaluate: (filter, card, { registry }) => {
      const def = registry.getCard(card.definitionId);
      return def ? def.cardType === filter.value : false;
    },
    name: "card-type",
  });

  // --- Numeric Filters ---
  const checkComparison = (actual: number, operator: string, target: number) => {
    switch (operator) {
      case "eq": {
        return actual === target;
      }
      case "ne": {
        return actual !== target;
      }
      case "gt": {
        return actual > target;
      }
      case "gte": {
        return actual >= target;
      }
      case "lt": {
        return actual < target;
      }
      case "lte": {
        return actual <= target;
      }
      default: {
        return false;
      }
    }
  };

  const getComparisonValue = (
    value: number | "target",
    // Context: FilterContext - unused for now
    // TODO: Implement getTargetValue when context is fully fleshed out
  ): number => {
    if (value === "target") {
      return 0;
    } // Placeholder
    return value;
  };

  filterRegistry.register<LorcanaFilter & { type: "strength"; comparison: any; value: any }>({
    complexity: 20,
    evaluate: (filter, card, ctx) => {
      const def = ctx.registry.getCard(card.definitionId);
      if (!def || def.cardType !== "character") {return false;}
      const targetVal = getComparisonValue(filter.value);
      return checkComparison((def as any).strength ?? 0, filter.comparison, targetVal);
    },
    name: "strength",
  });

  filterRegistry.register<LorcanaFilter & { type: "willpower"; comparison: any; value: any }>({
    complexity: 20,
    evaluate: (filter, card, ctx) => {
      const def = ctx.registry.getCard(card.definitionId);
      if (!def || def.cardType !== "character") {return false;}
      const targetVal = getComparisonValue(filter.value);
      return checkComparison((def as any).willpower ?? 0, filter.comparison, targetVal);
    },
    name: "willpower",
  });

  filterRegistry.register<LorcanaFilter & { type: "cost"; comparison: any; value: any }>({
    complexity: 20,
    evaluate: (filter, card, ctx) => {
      const def = ctx.registry.getCard(card.definitionId);
      if (!def) {return false;}
      const targetVal = getComparisonValue(filter.value);
      return checkComparison(def.cost, filter.comparison, targetVal);
    },
    name: "cost",
  });

  filterRegistry.register<LorcanaFilter & { type: "lore-value"; comparison: any; value: any }>({
    complexity: 20,
    evaluate: (filter, card, ctx) => {
      const def = ctx.registry.getCard(card.definitionId);
      if (!def || (def.cardType !== "character" && def.cardType !== "location")) {return false;}
      const targetVal = getComparisonValue(filter.value);
      return checkComparison((def as any).lore ?? 0, filter.comparison, targetVal);
    },
    name: "lore-value",
  });

  filterRegistry.register<LorcanaFilter & { type: "move-cost"; comparison: any; value: number }>({
    complexity: 20,
    evaluate: (filter, card, { registry }) => {
      const def = registry.getCard(card.definitionId);
      if (!def || def.cardType !== "location") {return false;}
      return checkComparison(def.moveCost ?? 0, filter.comparison, filter.value);
    },
    name: "move-cost",
  });

  filterRegistry.register<LorcanaFilter & { type: "at-location" }>({
    complexity: 30,
    evaluate: (_, card) => Boolean(card.atLocationId),
    name: "at-location",
  });

  // --- Composite Filters ---
  filterRegistry.register<LorcanaFilter & { type: "and"; filters: LorcanaFilter[] }>({
    complexity: 50,
    evaluate: (filter, card, context) => filter.filters.every((f) => {
        const handler = filterRegistry.get(f.type);
        return handler ? handler.evaluate(f, card, context) : false;
      }),
    name: "and",
  });

  filterRegistry.register<LorcanaFilter & { type: "or"; filters: LorcanaFilter[] }>({
    complexity: 50,
    evaluate: (filter, card, context) => filter.filters.some((f) => {
        const handler = filterRegistry.get(f.type);
        return handler ? handler.evaluate(f, card, context) : false;
      }),
    name: "or",
  });

  filterRegistry.register<LorcanaFilter & { type: "not"; filter: LorcanaFilter }>({
    complexity: 50,
    evaluate: (filter, card, context) => {
      // Safe cast because we validated the type string
      const handler = filterRegistry.get(
        filter.filter.type,
      ) as unknown as FilterHandler<LorcanaFilter>;
      return handler ? !handler.evaluate(filter.filter, card, context) : false;
    },
    name: "not",
  });
}
