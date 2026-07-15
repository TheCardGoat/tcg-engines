import type {
  CoreEffectNode,
  EffectExecutionResult,
  PrimitiveRuntime,
  PrimitiveValue,
} from "../types/index.ts";

// ── Primitive Value Resolution ───────────────────────────────────────────────

/**
 * Resolve a PrimitiveValue to its concrete runtime value.
 */
export function resolvePrimitiveValue(
  value: PrimitiveValue,
  resolveCount: (target: { kind: "resolved"; id: string } | { kind: "slot"; id: string }) => number,
  resolveAttribute: (
    target: { kind: "resolved"; id: string } | { kind: "slot"; id: string },
    attribute: string,
  ) => unknown,
): string | number | boolean | null {
  switch (value.kind) {
    case "literal":
      return value.value;
    case "count": {
      const count = resolveCount(value.target);
      return count * (value.multiplier ?? 1);
    }
    case "attribute": {
      const attr = resolveAttribute(value.target, value.attribute);
      if (typeof attr === "number") return attr;
      if (typeof attr === "string") return attr;
      if (typeof attr === "boolean") return attr;
      return null;
    }
  }
}

// ── Sequential Action Runner ─────────────────────────────────────────────────

/**
 * Run a sequence of effect nodes in order.
 *
 * If any step suspends or blocks, the runner returns immediately with
 * the remaining steps attached to the result.
 */
export function runSequence<TContext>(
  steps: readonly CoreEffectNode[],
  runtime: PrimitiveRuntime<TContext>,
  context: TContext,
): EffectExecutionResult<CoreEffectNode> {
  for (let i = 0; i < steps.length; i++) {
    const result = runEffectNode(steps[i]!, runtime, context);

    if (result.status === "suspended") {
      return {
        status: "suspended",
        remaining: [...(result.remaining ?? []), ...steps.slice(i + 1)],
      };
    }

    if (result.status === "blocked") {
      return {
        status: "blocked",
        blockedReason: result.blockedReason,
        remaining: [...(result.remaining ?? []), ...steps.slice(i + 1)],
      };
    }
  }

  return { status: "resolved" };
}

// ── Parallel Action Runner ───────────────────────────────────────────────────

/**
 * Run a set of effect nodes in parallel.
 *
 * All steps are evaluated independently. If any step blocks, the
 * entire parallel block blocks. If any step suspends, the result
 * is suspended with the union of remaining work.
 */
export function runParallel<TContext>(
  steps: readonly CoreEffectNode[],
  runtime: PrimitiveRuntime<TContext>,
  context: TContext,
): EffectExecutionResult<CoreEffectNode> {
  let hasBlocked = false;
  let blockedReason: string | undefined;
  let hasSuspended = false;
  const remaining: CoreEffectNode[] = [];

  for (const step of steps) {
    const result = runEffectNode(step, runtime, context);

    if (result.status === "blocked") {
      hasBlocked = true;
      blockedReason = result.blockedReason ?? blockedReason;
    } else if (result.status === "suspended") {
      hasSuspended = true;
      if (result.remaining) {
        remaining.push(...result.remaining);
      }
    }
  }

  if (hasBlocked) {
    return { status: "blocked", blockedReason, remaining };
  }

  if (hasSuspended) {
    return { status: "suspended", remaining };
  }

  return { status: "resolved" };
}

// ── Conditional Branch Runner ────────────────────────────────────────────────

/**
 * Run a conditional branch.
 *
 * The condition is evaluated by the caller; this helper just routes
 * to the correct branch.
 */
export function runConditional<TContext>(
  conditionResult: boolean,
  thenBranch: CoreEffectNode,
  otherwiseBranch: CoreEffectNode | undefined,
  runtime: PrimitiveRuntime<TContext>,
  context: TContext,
): EffectExecutionResult<CoreEffectNode> {
  if (conditionResult) {
    return runEffectNode(thenBranch, runtime, context);
  }
  if (otherwiseBranch) {
    return runEffectNode(otherwiseBranch, runtime, context);
  }
  return { status: "resolved" };
}

// ── Repeat Runner ────────────────────────────────────────────────────────────

/**
 * Run a step N times.
 */
export function runRepeat<TContext>(
  count: number,
  step: CoreEffectNode,
  runtime: PrimitiveRuntime<TContext>,
  context: TContext,
): EffectExecutionResult<CoreEffectNode> {
  const steps: CoreEffectNode[] = Array.from({ length: count }, () => ({ ...step }));
  // Shallow copy is sufficient here: CoreEffectNode is a plain discriminated-union
  // object, and any nested `steps` arrays are processed recursively by runSequence.
  return runSequence(steps, runtime, context);
}

// ── Choose / Optional Suspension ─────────────────────────────────────────────

/**
 * Produce a suspended result for a player-choice prompt.
 */
export function suspendForChoice(
  _prompt: { id: string; target: unknown; min: number; max: number },
  then: CoreEffectNode,
): EffectExecutionResult<CoreEffectNode> {
  return {
    status: "suspended",
    remaining: [then],
  };
}

// ── Effect Node Dispatcher ───────────────────────────────────────────────────

/**
 * Dispatch a single effect node to the appropriate runner.
 *
 * Primitive actions are forwarded to the `PrimitiveRuntime.apply`.
 * Composition nodes (sequence, parallel, when, repeat, choose, optional)
 * are handled by the shared runners above.
 */
export function runEffectNode<TContext>(
  node: CoreEffectNode,
  runtime: PrimitiveRuntime<TContext>,
  context: TContext,
): EffectExecutionResult<CoreEffectNode> {
  switch (node.op) {
    case "sequence":
      return runSequence(node.steps, runtime, context);

    case "parallel":
      return runParallel(node.steps, runtime, context);

    case "when": {
      // The condition evaluation is intentionally left to the caller
      // because it may require game-specific context. The runtime
      // should pre-evaluate the condition and call runConditional.
      // For now, we treat an unevaluated "when" as a runtime error.
      return {
        status: "blocked",
        blockedReason: `Un-evaluated "when" node — condition must be resolved before calling runEffectNode`,
      };
    }

    case "repeat": {
      // Count resolution is also left to the caller/runtime.
      return {
        status: "blocked",
        blockedReason: `Un-evaluated "repeat" node — count must be resolved before calling runEffectNode`,
      };
    }

    case "choose":
      return suspendForChoice(node.prompt, node.then);

    case "optional":
      return suspendForChoice(node.prompt, node.then);

    case "meta.adjustNumber":
    case "meta.set":
    case "meta.remove":
    case "entity.move":
    case "entity.create":
    case "event.emit":
    case "log.emit": {
      return runtime.apply(node, context) as EffectExecutionResult<CoreEffectNode>;
    }

    default: {
      // Exhaustive check — if we reach here, a new op was added
      // without updating the dispatcher.
      return {
        status: "blocked",
        blockedReason: `Unknown effect node op: ${formatUnknownEffectNodeOp(node)}`,
      };
    }
  }
}

function formatUnknownEffectNodeOp(node: never): string {
  return String((node as { op?: unknown }).op);
}
