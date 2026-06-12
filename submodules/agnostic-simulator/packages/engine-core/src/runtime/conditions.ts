import type { Comparison, TargetEvaluationContext } from "../types/index.ts";
import { compareValues, resolveRelativeOwner } from "./targeting.ts";
import type { CoreCondition, ConditionPredicateAdapter } from "../types/index.ts";

type AndCondition<TPredicate extends string> = {
  type: "and";
  conditions: CoreCondition<TPredicate>[];
};
type OrCondition<TPredicate extends string> = {
  type: "or";
  conditions: CoreCondition<TPredicate>[];
};
type NotCondition<TPredicate extends string> = {
  type: "not";
  condition: CoreCondition<TPredicate>;
};
type TurnCondition = {
  type: "turn";
  player: Parameters<typeof resolveRelativeOwner>[0];
};

/**
 * Evaluate a core condition against a context.
 *
 * Built-in predicates (`and`, `or`, `not`, `turn`, `entityCount`, `attribute`)
 * are evaluated directly. Any unknown predicate type is forwarded to the
 * supplied `adapter`.
 *
 * @param condition - The condition to evaluate
 * @param ctx - A context that combines game state with targeting access
 * @param adapter - Adapter for game-specific predicate types
 * @param targetCtx - Optional targeting context for entityCount/attribute conditions
 */
export function evaluateCoreCondition<TPredicate extends string, TContext>(
  condition: CoreCondition<TPredicate>,
  ctx: TContext,
  adapter: ConditionPredicateAdapter<CoreCondition<TPredicate>, TContext>,
  targetCtx?: TargetEvaluationContext<unknown, string>,
): boolean {
  switch (condition.type) {
    case "and": {
      const andCondition = condition as AndCondition<TPredicate>;
      return andCondition.conditions.every((c: CoreCondition<TPredicate>) =>
        evaluateCoreCondition(c, ctx, adapter, targetCtx),
      );
    }

    case "or": {
      const orCondition = condition as OrCondition<TPredicate>;
      return orCondition.conditions.some((c: CoreCondition<TPredicate>) =>
        evaluateCoreCondition(c, ctx, adapter, targetCtx),
      );
    }

    case "not": {
      const notCondition = condition as NotCondition<TPredicate>;
      return !evaluateCoreCondition(notCondition.condition, ctx, adapter, targetCtx);
    }

    case "turn": {
      if (!targetCtx) return false;
      const turnCondition = condition as TurnCondition;
      const resolved = resolveRelativeOwner(
        turnCondition.player,
        targetCtx.sourcePlayerId,
        (playerId) => targetCtx.opponentOf(playerId),
      );
      if (resolved === "any") return true;
      if (resolved === "self") {
        return (
          (targetCtx.currentTurnPlayerId ?? targetCtx.activePlayerId) === targetCtx.sourcePlayerId
        );
      }
      return (targetCtx.currentTurnPlayerId ?? targetCtx.activePlayerId) === resolved;
    }

    case "entityCount": {
      if (!targetCtx) return false;
      // The target field is game-defined; the adapter or game layer is
      // responsible for turning it into a candidate list. We pass the
      // condition to the adapter so the game can resolve its native
      // target DSL into a count.
      return adapter.evaluate(condition, ctx);
    }

    case "attribute": {
      if (!targetCtx) return false;
      // The target field is game-defined; the adapter resolves it.
      return adapter.evaluate(condition, ctx);
    }

    default: {
      return adapter.evaluate(condition, ctx);
    }
  }
}

/**
 * Evaluate a numeric comparison condition.
 *
 * Helper for adapters that need to evaluate simple numeric conditions.
 */
export function evaluateNumericCondition(
  actual: number,
  comparison: Comparison,
  expected: number,
): boolean {
  return compareValues(actual, comparison, expected);
}

/**
 * Evaluate a string equality condition.
 */
export function evaluateStringCondition(
  actual: string,
  comparison: "eq" | "neq" | "includes" | "excludes",
  expected: string,
): boolean {
  switch (comparison) {
    case "eq":
      return actual === expected;
    case "neq":
      return actual !== expected;
    case "includes": {
      const aLower = actual.toLowerCase();
      const eLower = expected.toLowerCase();
      return aLower.includes(eLower);
    }
    case "excludes": {
      const aLower = actual.toLowerCase();
      const eLower = expected.toLowerCase();
      return !aLower.includes(eLower);
    }
  }
}
