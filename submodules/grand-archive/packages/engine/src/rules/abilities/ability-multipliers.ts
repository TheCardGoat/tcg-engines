import type { GrandArchiveExecutableAbility } from "@tcg/grand-archive-types";
import {
  flattenGrandArchiveAbilities,
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityIsFunctional,
  grandArchiveObjectFace,
} from "../../game/card-runtime.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "../../game/model.ts";

function labelMatches(actual: string, requested: string): boolean {
  const normalizedActual = actual.trim().toLocaleLowerCase();
  const normalizedRequested = requested.trim().toLocaleLowerCase();
  return (
    normalizedActual === normalizedRequested ||
    normalizedActual.startsWith(`${normalizedRequested} `)
  );
}

/** Returns how many extra copies of one labeled ability currently exist on an object. */
export function grandArchiveAdditionalAbilityInstances(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
): number {
  if (!("label" in ability) || !ability.label) return 0;
  let additional = 0;
  for (const source of Object.values(state.objects)) {
    const face = grandArchiveObjectFace(program, source);
    for (const modifierAbility of flattenGrandArchiveAbilities(face.abilities)) {
      if (modifierAbility.kind !== "static" || modifierAbility.staticKind !== "effects") continue;
      const executionObject = grandArchiveAbilityExecutionObject(state, source, modifierAbility);
      if (!executionObject) continue;
      const evaluation = withGrandArchiveDerivedVariables(modifierAbility.variables, {
        program,
        state,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        bindings: {},
      });
      if (
        !grandArchiveAbilityIsFunctional(face, modifierAbility, source) ||
        modifierAbility.restrictions?.some(
          (restriction) =>
            restriction.kind === "static" &&
            !evaluateGrandArchiveCondition(restriction.condition, evaluation),
        ) ||
        (modifierAbility.condition &&
          !evaluateGrandArchiveCondition(modifierAbility.condition, evaluation))
      ) {
        continue;
      }
      for (const effect of modifierAbility.effects) {
        if (
          effect.kind !== "ability-multiplier" ||
          !labelMatches(ability.label.name, effect.abilityFilter.label) ||
          !resolveGrandArchiveSubjectObjects(effect.subjects, evaluation).some(
            (candidate) => candidate.id === object.id,
          )
        ) {
          continue;
        }
        const amount = evaluateGrandArchiveAmount(effect.additionalInstances, evaluation);
        if (!Number.isSafeInteger(amount) || amount < 0) {
          throw new GrandArchiveUnsupportedRuleError(
            "ability multiplier must be a non-negative integer",
          );
        }
        additional += amount;
      }
    }
  }
  return additional;
}
