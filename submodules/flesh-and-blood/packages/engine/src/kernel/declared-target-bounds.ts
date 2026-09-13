import {
  isQuantifier,
  isUpToCount,
  type FabSelectionCount,
  type FabTarget,
} from "@tcg/flesh-and-blood-types";

/** Resolve an on-stack object target's numeric bound and whether 0 is legal. */
export function declaredObjectTargetBounds(
  target: Extract<FabTarget, { selector: "object" }>,
  evaluate: (count: FabSelectionCount) => number | null,
  optional: boolean,
  candidateCount: number,
): { count: number; min: number } | null {
  const raw = target.count;
  if (isQuantifier(raw)) {
    if (raw.type === "any-number") return { count: candidateCount, min: 0 };
    return { count: candidateCount, min: optional ? 0 : candidateCount };
  }
  const upTo = target.upTo === true || isUpToCount(raw);
  const count = evaluate(isUpToCount(raw) ? raw.amount : raw);
  if (count === null) return null;
  return { count, min: optional || upTo ? 0 : count };
}
