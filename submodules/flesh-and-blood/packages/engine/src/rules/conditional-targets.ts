import type { FabEffect, FabTarget } from "@tcg/flesh-and-blood-types";

export type FabDeclaredTarget =
  | Extract<FabTarget, { readonly selector: "object" }>
  | {
      readonly selector: "any-hero";
    };

function isDeclaredTarget(target: unknown): target is FabDeclaredTarget {
  return (
    typeof target === "object" &&
    target !== null &&
    "selector" in target &&
    (target.selector === "any-hero" ||
      (target.selector === "object" && "declared" in target && target.declared === "on-stack"))
  );
}

function sameValue(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => sameValue(value, right[index]))
    );
  }
  if (typeof left !== "object" || left === null || typeof right !== "object" || right === null)
    return false;
  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord).sort();
  const rightKeys = Object.keys(rightRecord).sort();
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key, index) => key === rightKeys[index] && sameValue(leftRecord[key], rightRecord[key]),
    )
  );
}

function directDeclaredTarget(effect: FabEffect): FabDeclaredTarget | null {
  if (!("target" in effect) || !isDeclaredTarget(effect.target)) return null;
  return effect.target;
}

/**
 * A conditional's two result branches sometimes have one identical target
 * declared at the shared layer boundary. Model that as one player choice, not
 * two sequential choices that happen to select the same hero or object.
 */
export function sharedConditionalBranchTarget(
  effect: Extract<FabEffect, { readonly type: "conditional" }>,
): FabDeclaredTarget | null {
  if (!effect.else) return null;
  const thenTarget = directDeclaredTarget(effect.then);
  const elseTarget = directDeclaredTarget(effect.else);
  return thenTarget && elseTarget && sameValue(thenTarget, elseTarget) ? thenTarget : null;
}

export function isSameDeclaredTarget(
  target: unknown,
  expected: FabDeclaredTarget | null | undefined,
): boolean {
  return (
    expected !== null &&
    expected !== undefined &&
    isDeclaredTarget(target) &&
    sameValue(target, expected)
  );
}
