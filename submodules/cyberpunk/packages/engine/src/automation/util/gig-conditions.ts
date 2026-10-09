import type { FilteredAbilityHint } from "../../view/ability-hints.ts";

export type GigCondition =
  | "hasGigPair"
  | "hasDistinctGigValues"
  | "hasMinGig"
  | "hasEvenAndOddGigValues";

export function isGigCondition(condition: string): condition is GigCondition {
  return (
    condition === "hasGigPair" ||
    condition === "hasDistinctGigValues" ||
    condition === "hasMinGig" ||
    condition === "hasEvenAndOddGigValues"
  );
}

export function gigConditionSatisfied(
  condition: GigCondition,
  values: readonly number[],
  hint: FilteredAbilityHint,
): boolean {
  switch (condition) {
    case "hasGigPair":
      return new Set(values).size < values.length;
    case "hasDistinctGigValues": {
      const minimum = Math.max(
        2,
        ...hint.conditionThresholds
          .filter((threshold) => threshold.condition === condition)
          .map((threshold) => threshold.minCount),
      );
      return new Set(values).size >= minimum;
    }
    case "hasMinGig":
      return values.includes(1);
    case "hasEvenAndOddGigValues":
      return values.some((value) => value % 2 === 0) && values.some((value) => value % 2 !== 0);
  }
}
