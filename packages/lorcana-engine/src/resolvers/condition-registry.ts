import type { CardInstance, CardRegistry } from "@tcg/core";
import type { Condition } from "../cards/abilities/types/condition-types";
import type { LorcanaContext } from "../targeting/lorcana-target-dsl";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { LorcanaCardMeta, LorcanaGameState } from "../types/game-state";

/**
 * Context for condition evaluation
 */
export interface ConditionEvaluationContext {
  state: LorcanaGameState;
  registry: CardRegistry<LorcanaCardDefinition>;
  context?: LorcanaContext;
}

/**
 * Handler for a specific condition type
 */
export interface ConditionHandler<T extends Condition = Condition> {
  /**
   * Evaluate the condition
   */
  evaluate: (
    condition: T,
    sourceCard: CardInstance<LorcanaCardMeta>,
    ctx: ConditionEvaluationContext,
  ) => boolean;

  /**
   * Complexity rank for sorting (lower = evaluated first)
   *
   * Suggestions:
   * 0-10: Simple property checks (exerted, ready)
   * 11-20: Turn/Phase checks
   * 21-40: Count checks (resources)
   * 41-60: Simple Filters (has card named X)
   * 61-90: Complex Filters / Queries
   * 99+: Deep recursion / expensive checks
   */
  complexity: number;
}

/**
 * Registry for condition handlers
 */
class ConditionRegistry {
  private handlers = new Map<Condition["type"], ConditionHandler<any>>();

  /**
   * Register a new condition handler
   */
  register<T extends Condition>(type: T["type"], handler: ConditionHandler<T>) {
    this.handlers.set(type, handler);
  }

  /**
   * Get handler for a condition type
   */
  get<T extends Condition>(type: T["type"]): ConditionHandler<T> | undefined {
    return this.handlers.get(type) as ConditionHandler<T> | undefined;
  }

  /**
   * Check if a handler exists for a type
   */
  has(type: string): boolean {
    return this.handlers.has(type as Condition["type"]);
  }
}

export const conditionRegistry = new ConditionRegistry();
