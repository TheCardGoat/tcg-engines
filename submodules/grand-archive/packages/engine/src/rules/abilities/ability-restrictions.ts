import type {
  GrandArchiveAbilityBase,
  GrandArchiveCondition,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";

function combinedCondition(conditions: readonly GrandArchiveCondition[]): GrandArchiveCondition {
  const first = conditions[0];
  if (!first) throw new Error("Cannot combine an empty restriction set");
  return conditions.length === 1 ? first : { kind: "all", conditions };
}

/**
 * Inline restrictions are instructions on the resolving ability, not
 * announcement gates. Preserve the announced stack item and defer the check
 * until this conditional frame is executed.
 */
export function applyGrandArchiveInlineRestrictions(
  ability: Pick<GrandArchiveAbilityBase, "restrictions">,
  effect: GrandArchiveEffect,
): GrandArchiveEffect {
  const conditions =
    ability.restrictions?.flatMap((restriction) =>
      restriction.kind === "inline" ? [restriction.condition] : [],
    ) ?? [];
  if (conditions.length === 0) return effect;
  return {
    kind: "conditional",
    condition: combinedCondition(conditions),
    then: effect,
  };
}
