/**
 * Immediate-decision resolution shape for automation planning.
 *
 * The engine peels multi-step / multi-may effects sequentially (outer optional
 * suspends, then later steps become residual bag/pending items). The planner
 * must therefore inspect only the **current** decision surface — not every
 * nested optional/choice in the full printed tree — or legal bag items with
 * optionalCount > 1 are rejected and the bot deadlocks into concede.
 */
import type { Effect } from "@tcg/lorcana-types";
import type { AutomatedActionResolutionShape } from "./types";

type EffectInspectionNode = Effect & {
  amount?: number | string | Record<string, unknown>;
  choices?: Effect[];
  destinations?: unknown[];
  effect?: Effect;
  effects?: Effect[];
  else?: Effect;
  falseEffect?: Effect;
  ifFalse?: Effect;
  ifTrue?: Effect;
  options?: Effect[];
  ordering?: string;
  steps?: Effect[];
  then?: Effect;
  trueEffect?: Effect;
  type: string;
};

function asNode(effect: Effect | undefined): EffectInspectionNode | undefined {
  if (!effect || typeof effect !== "object") {
    return undefined;
  }
  return effect as EffectInspectionNode;
}

function emptyShape(): AutomatedActionResolutionShape {
  return {
    choiceCount: 0,
    optionalCount: 0,
    requiresDestinations: false,
    requiresNamedCard: false,
    requiresOrderedTargets: false,
    usesAmountSelection: false,
  };
}

function mergeFlagShape(
  into: AutomatedActionResolutionShape,
  from: AutomatedActionResolutionShape,
): void {
  into.requiresDestinations = into.requiresDestinations || from.requiresDestinations;
  into.requiresNamedCard = into.requiresNamedCard || from.requiresNamedCard;
  into.requiresOrderedTargets = into.requiresOrderedTargets || from.requiresOrderedTargets;
  into.usesAmountSelection = into.usesAmountSelection || from.usesAmountSelection;
}

/**
 * Collect non-branching support flags (scry destinations, name-a-card, ordered
 * put-on-bottom, amount selection) without counting nested optionals/choices.
 * Used under an outer optional/choice so deeper mays do not inflate the matrix.
 */
function inspectSupportFlagsOnly(effect: Effect | undefined): AutomatedActionResolutionShape {
  const shape = emptyShape();
  const visit = (current: Effect | undefined): void => {
    const node = asNode(current);
    if (!node) {
      return;
    }

    switch (node.type) {
      case "optional":
      case "choice":
      case "or":
        // Nested branching is a later decision surface — stop.
        return;
      case "name-a-card":
        shape.requiresNamedCard = true;
        return;
      case "scry":
        if ((node.destinations?.length ?? 0) > 0) {
          shape.requiresDestinations = true;
        }
        return;
      case "put-on-bottom":
        if (node.ordering === "player-choice") {
          shape.requiresOrderedTargets = true;
        }
        return;
      case "sequence": {
        const steps = node.steps ?? node.effects ?? [];
        // Only the first residual step can prompt now.
        if (steps[0]) {
          visit(steps[0]);
        }
        return;
      }
      case "conditional":
        visit(node.then ?? node.ifTrue ?? node.trueEffect);
        visit(node.else ?? node.ifFalse ?? node.falseEffect);
        return;
      default:
        break;
    }

    // Unknown wrappers: shallow-walk common nests but stop at branching.
    for (const nested of [
      node.effect,
      node.then,
      node.else,
      node.ifTrue,
      node.ifFalse,
      node.trueEffect,
      node.falseEffect,
      ...(node.effects ?? []),
      ...(node.steps ?? []),
    ]) {
      const nestedNode = asNode(nested);
      if (!nestedNode) {
        continue;
      }
      if (
        nestedNode.type === "optional" ||
        nestedNode.type === "choice" ||
        nestedNode.type === "or"
      ) {
        continue;
      }
      visit(nested);
    }
  };

  visit(effect);
  return shape;
}

/**
 * Shape of the **first** interactive decision the engine will surface for this
 * residual effect. Nested mays/choices behind that decision are ignored.
 */
export function inspectImmediateResolutionShape(
  effect: Effect | undefined,
): AutomatedActionResolutionShape {
  const shape = emptyShape();
  const node = asNode(effect);
  if (!node) {
    return shape;
  }

  switch (node.type) {
    case "optional": {
      shape.optionalCount = 1;
      mergeFlagShape(shape, inspectSupportFlagsOnly(node.effect));
      return shape;
    }
    case "choice":
    case "or": {
      shape.choiceCount = 1;
      shape.choiceOptionCount = Math.max(
        shape.choiceOptionCount ?? 0,
        node.options?.length ?? node.choices?.length ?? 0,
      );
      for (const option of node.options ?? node.choices ?? []) {
        mergeFlagShape(shape, inspectSupportFlagsOnly(option));
        // Nested choice/or under a branch is not a separate residual in runtime —
        // the same choiceIndex is reused into the selected option. Mark unsupported
        // via choiceCount > 1 so the planner can refuse instead of under-planning.
        if (optionContainsNestedChoice(option)) {
          shape.choiceCount = 2;
        }
      }
      return shape;
    }
    case "sequence": {
      const steps = node.steps ?? node.effects ?? [];
      if (steps[0]) {
        return inspectImmediateResolutionShape(steps[0]);
      }
      return shape;
    }
    case "conditional": {
      const thenBranch = node.then ?? node.ifTrue ?? node.trueEffect;
      const elseBranch = node.else ?? node.ifFalse ?? node.falseEffect;
      // Single-arm residuals (e.g. if-you-do `then` only) can peel. Dual-arm
      // conditionals must not assume the true branch is live — the engine
      // evaluates the condition at resolve time (Buzz/Woody "choose both").
      if (thenBranch && elseBranch) {
        mergeFlagShape(shape, inspectSupportFlagsOnly(thenBranch));
        mergeFlagShape(shape, inspectSupportFlagsOnly(elseBranch));
        return shape;
      }
      if (thenBranch) {
        return inspectImmediateResolutionShape(thenBranch);
      }
      if (elseBranch) {
        return inspectImmediateResolutionShape(elseBranch);
      }
      return shape;
    }
    case "name-a-card":
      shape.requiresNamedCard = true;
      return shape;
    case "scry":
      if ((node.destinations?.length ?? 0) > 0) {
        shape.requiresDestinations = true;
      }
      return shape;
    case "put-on-bottom":
      if (node.ordering === "player-choice") {
        shape.requiresOrderedTargets = true;
      }
      return shape;
    default: {
      // Non-branching leaf or wrapper: flags only for this node / shallow nests.
      mergeFlagShape(shape, inspectSupportFlagsOnly(effect));
      return shape;
    }
  }
}

/**
 * Residual effect used for target / scry planning of the current decision.
 *
 * Peels sequence / conditional wrappers and unwraps a single outer optional so
 * nested mays (later decision surfaces) are not included in target analysis.
 */
export function getImmediatePlanningEffect(effect: Effect | undefined): Effect | undefined {
  const node = asNode(effect);
  if (!node) {
    return effect;
  }

  switch (node.type) {
    case "optional": {
      // Targets for accept belong to the non-branching child surface. Nested
      // optional/choice/or is the *next* decision residual after accept — do not
      // peel into it (matches inspectImmediateResolutionShape / flags-only stop).
      const child = node.effect;
      const childNode = asNode(child);
      if (!childNode) {
        return child;
      }
      if (childNode.type === "optional" || childNode.type === "choice" || childNode.type === "or") {
        return child;
      }
      return getImmediatePlanningEffect(child) ?? child;
    }
    case "sequence": {
      const steps = node.steps ?? node.effects ?? [];
      return steps[0] ? getImmediatePlanningEffect(steps[0]) : effect;
    }
    case "conditional": {
      const thenBranch = node.then ?? node.ifTrue ?? node.trueEffect;
      const elseBranch = node.else ?? node.ifFalse ?? node.falseEffect;
      if (thenBranch && elseBranch) {
        // Preserve dual-arm conditionals so target planning does not bake in
        // only the true branch (wrong when the live arm is `else`).
        return effect;
      }
      if (thenBranch) {
        return getImmediatePlanningEffect(thenBranch) ?? thenBranch;
      }
      if (elseBranch) {
        return getImmediatePlanningEffect(elseBranch) ?? elseBranch;
      }
      return effect;
    }
    default:
      return effect;
  }
}

/** True when an option arm eventually reaches another choice/or surface. */
function optionContainsNestedChoice(effect: Effect | undefined): boolean {
  const node = asNode(effect);
  if (!node) {
    return false;
  }
  if (node.type === "choice" || node.type === "or") {
    return true;
  }
  if (node.type === "optional") {
    return optionContainsNestedChoice(node.effect);
  }
  if (node.type === "sequence") {
    // Walk every step: a nested choice later in the sequence still reuses the
    // outer choiceIndex rather than becoming an independent residual.
    const steps = node.steps ?? node.effects ?? [];
    return steps.some((step) => optionContainsNestedChoice(step));
  }
  if (node.type === "conditional") {
    return (
      optionContainsNestedChoice(node.then ?? node.ifTrue ?? node.trueEffect) ||
      optionContainsNestedChoice(node.else ?? node.ifFalse ?? node.falseEffect)
    );
  }
  // Generic wrappers (pay-cost, for-each, …) forward the same resolution input
  // to `effect` — recurse so nested choice under a wrapper still marks multi-choice.
  if (node.effect) {
    return optionContainsNestedChoice(node.effect);
  }
  return false;
}

/**
 * Full-tree shape inspection (legacy). Prefer {@link inspectImmediateResolutionShape}
 * for automation support-matrix checks.
 */
export function inspectFullResolutionShape(
  effect: Effect | undefined,
): AutomatedActionResolutionShape {
  const shape = emptyShape();

  const visit = (current: Effect | undefined): void => {
    const node = asNode(current);
    if (!node) {
      return;
    }

    switch (node.type) {
      case "optional":
        shape.optionalCount += 1;
        break;
      case "choice":
      case "or":
        shape.choiceCount += 1;
        shape.choiceOptionCount = Math.max(
          shape.choiceOptionCount ?? 0,
          node.options?.length ?? node.choices?.length ?? 0,
        );
        break;
      case "name-a-card":
        shape.requiresNamedCard = true;
        break;
      case "scry":
        if ((node.destinations?.length ?? 0) > 0) {
          shape.requiresDestinations = true;
        }
        break;
      case "put-on-bottom":
        if (node.ordering === "player-choice") {
          shape.requiresOrderedTargets = true;
        }
        break;
    }

    for (const nested of [
      node.effect,
      node.then,
      node.else,
      node.ifTrue,
      node.ifFalse,
      node.trueEffect,
      node.falseEffect,
      ...(node.effects ?? []),
      ...(node.steps ?? []),
      ...(node.options ?? []),
      ...(node.choices ?? []),
    ]) {
      visit(nested);
    }
  };

  visit(effect);
  return shape;
}
