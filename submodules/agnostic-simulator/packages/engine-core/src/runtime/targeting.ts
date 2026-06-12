import type {
  Comparison,
  RelativeOwner,
  SelectionBounds,
  TargetEvaluationContext,
  CoreTargetExpression,
  TargetResult,
  AttributePredicate,
  TargetProjectionResult,
} from "../types/index.ts";

// ── Relative Owner Resolution ────────────────────────────────────────────────

/**
 * Resolve a RelativeOwner to a concrete player id, or to a sentinel value
 * that the caller must handle specially.
 */
export function resolveRelativeOwner(
  owner: RelativeOwner,
  sourcePlayerId: string,
  opponentOf: (playerId: string) => string,
): string {
  switch (owner) {
    case "friendly":
      return sourcePlayerId;
    case "opponent":
      return opponentOf(sourcePlayerId);
    case "self":
      return "self";
    case "any":
      return "any";
  }
}

// ── Comparison Helpers ───────────────────────────────────────────────────────

/**
 * Compare two numbers using the given comparison operator.
 */
export function compareValues(actual: number, op: Comparison, expected: number): boolean {
  switch (op) {
    case "eq":
      return actual === expected;
    case "lt":
      return actual < expected;
    case "lte":
      return actual <= expected;
    case "gt":
      return actual > expected;
    case "gte":
      return actual >= expected;
  }
}

// ── Attribute Predicate Evaluation ───────────────────────────────────────────

/**
 * Evaluate a single attribute predicate against a read value.
 *
 * The caller is responsible for reading the attribute from the entity
 * via the evaluation context; this function only handles the comparison.
 */
export function evaluateAttributePredicate(
  predicate: AttributePredicate,
  actual: unknown,
): boolean {
  switch (predicate.comparison) {
    case "eq":
      return actual === predicate.value;
    case "neq":
      return actual !== predicate.value;
    case "lt":
      return typeof actual === "number" && actual < (predicate.value as number);
    case "lte":
      return typeof actual === "number" && actual <= (predicate.value as number);
    case "gt":
      return typeof actual === "number" && actual > (predicate.value as number);
    case "gte":
      return typeof actual === "number" && actual >= (predicate.value as number);
    case "includes": {
      if (Array.isArray(actual)) {
        return actual.includes(predicate.value);
      }
      if (typeof actual === "string" && typeof predicate.value === "string") {
        return actual.toLowerCase().includes(predicate.value.toLowerCase());
      }
      warnUnsupportedAttributeComparison("includes", actual, predicate.value);
      return false;
    }
    case "excludes": {
      if (Array.isArray(actual)) {
        return !actual.includes(predicate.value);
      }
      if (typeof actual === "string" && typeof predicate.value === "string") {
        return !actual.toLowerCase().includes(predicate.value.toLowerCase());
      }
      warnUnsupportedAttributeComparison("excludes", actual, predicate.value);
      return false;
    }
  }
}

function warnUnsupportedAttributeComparison(
  comparison: "includes" | "excludes",
  actual: unknown,
  expected: unknown,
): void {
  if (runtimeNodeEnv() === "production") return;
  if (typeof console === "undefined") return;
  console.warn(`Unsupported ${comparison} comparison for non-string/non-array attribute values.`, {
    actual,
    expected,
  });
}

function runtimeNodeEnv(): string | undefined {
  const processLike = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
  return processLike?.env?.NODE_ENV;
}

// ── Selection Bounds ─────────────────────────────────────────────────────────

/**
 * Normalize a count spec into concrete min/max bounds.
 */
export function normalizeBounds(
  count: number | "all" | SelectionBounds | undefined,
  candidateCount: number,
): { min: number; max: number } {
  if (count === undefined) {
    return { min: 1, max: 1 };
  }
  if (count === "all") {
    return { min: candidateCount, max: candidateCount };
  }
  if (typeof count === "number") {
    return { min: count, max: count };
  }
  return {
    min: count.min,
    max: count.max === "all" ? candidateCount : count.max,
  };
}

// ── Core Target Expression Evaluation ────────────────────────────────────────

/**
 * Evaluate the shared subset of a core target expression against a context.
 *
 * This handles owner, zone, attribute, source exclusion, and logical
 * composition. Kind checks and game-specific predicates (e.g.,
 * "isBattling", "sameGigValue") are resolved by each game's registry
 * before or after this helper runs.
 *
 * The returned array contains the entity objects that matched; the
 * caller maps them to ids or protocol candidates.
 */
export function evaluateCoreTargetExpression<TEntity, TZone extends string>(
  expr: CoreTargetExpression,
  ctx: TargetEvaluationContext<TEntity, TZone>,
  candidates: readonly TEntity[],
): readonly TEntity[] {
  switch (expr.op) {
    case "kind": {
      // Kind is a game-defined classification; callers must pre-filter
      // candidates by kind because this context has no entity-kind reader.
      return candidates;
    }

    case "owner": {
      const resolved = resolveRelativeOwner(expr.owner, ctx.sourcePlayerId, (playerId) =>
        ctx.opponentOf(playerId),
      );
      if (resolved === "any") return candidates;
      if (resolved === "self") {
        return candidates.filter((e) => ctx.entityId(e) === ctx.sourceEntityId);
      }
      return candidates.filter((e) => ctx.entityController(e) === resolved);
    }

    case "zone": {
      return candidates.filter((e) => expr.zones.includes(ctx.entityZone(e)));
    }

    case "attribute": {
      return candidates.filter((e) => {
        const actual = ctx.readAttribute(e, expr.predicate.attribute);
        return evaluateAttributePredicate(expr.predicate, actual);
      });
    }

    case "excludeSource": {
      return candidates.filter((e) => ctx.entityId(e) !== expr.sourceId);
    }

    case "and": {
      let result = candidates;
      for (const sub of expr.filters) {
        result = evaluateCoreTargetExpression(sub, ctx, result);
      }
      return result;
    }

    case "or": {
      const matched = new Set<string>();
      for (const sub of expr.filters) {
        for (const e of evaluateCoreTargetExpression(sub, ctx, candidates)) {
          matched.add(ctx.entityId(e));
        }
      }
      return candidates.filter((e) => matched.has(ctx.entityId(e)));
    }

    case "bound":
    case "context":
    case "self":
    case "highest":
    case "lowest": {
      // These ops require game-layer context (bound targets, resolved
      // context targets, numeric property access). The shared layer
      // returns candidates unchanged; the game layer must pre-process
      // or post-process these nodes.
      return candidates;
    }
  }
}

/**
 * Build a TargetResult from a list of matched entity ids and selection bounds.
 */
export function buildTargetResult(
  entityIds: readonly string[],
  count: number | "all" | SelectionBounds | undefined,
  ordered = false,
): TargetResult {
  const bounds = normalizeBounds(count, entityIds.length);
  return {
    entityIds,
    min: bounds.min,
    max: bounds.max,
    ordered,
  };
}

/**
 * Build a TargetProjectionResult from matched entities.
 *
 * This is the shared conversion point that produces both the engine result
 * and the protocol candidate list from the same evaluation pass.
 */
export function buildTargetProjection(
  entityIds: readonly string[],
  kind: string,
  count: number | "all" | SelectionBounds | undefined,
  ordered = false,
  disabled?: ReadonlyMap<string, string>,
): TargetProjectionResult {
  const bounds = normalizeBounds(count, entityIds.length);
  const candidates = entityIds.map((id) => ({
    id,
    kind,
    disabledReason: disabled?.get(id),
  }));

  return {
    engine: {
      entityIds,
      min: bounds.min,
      max: bounds.max,
      ordered,
      disabled,
    },
    protocol: {
      inputType: "entitySelection",
      candidates,
      min: bounds.min,
      max: bounds.max,
      ordered,
    },
  };
}
