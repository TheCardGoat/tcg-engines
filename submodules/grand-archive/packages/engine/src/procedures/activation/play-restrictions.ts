import type {
  GrandArchiveAbilityCost,
  GrandArchiveAbilityModifier,
  GrandArchiveCardFace,
  GrandArchiveCardResolution,
  GrandArchiveExecutableAbility,
} from "@tcg/grand-archive-types";
import { flattenGrandArchiveAbilities } from "../../game/card-runtime.ts";
import {
  evaluateGrandArchiveCondition,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../effects/evaluation.ts";
import { grandArchiveObjectActiveAbilities } from "../../rules/abilities/intrinsic-keywords.ts";
import { applyGrandArchiveInlineRestrictions } from "../../rules/abilities/ability-restrictions.ts";

function activeAbilities(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  evaluation: GrandArchiveEvaluationContext,
) {
  const source = evaluation.sourceId ? evaluation.state.objects[evaluation.sourceId] : undefined;
  return source
    ? grandArchiveObjectActiveAbilities(evaluation.program, evaluation.state, source)
    : flattenGrandArchiveAbilities(face.abilities);
}

function staticRestrictionsSatisfied(
  ability: GrandArchiveExecutableAbility,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  return !ability.restrictions?.some(
    (restriction) =>
      restriction.kind === "static" &&
      !evaluateGrandArchiveCondition(restriction.condition, evaluation),
  );
}

/** Enforces all printed requirements that gate playing the source card in every zone. */
export function assertGrandArchivePlayRestrictions(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  evaluation: GrandArchiveEvaluationContext,
): void {
  for (const ability of activeAbilities(face, evaluation)) {
    if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
    const abilityEvaluation = withGrandArchiveDerivedVariables(ability.variables, evaluation);
    for (const effect of ability.effects) {
      if (
        effect.kind !== "rule-modification" ||
        effect.mode !== "require" ||
        effect.action !== "play"
      ) {
        continue;
      }
      if (!effect.subject || !effect.condition) {
        throw new GrandArchiveUnsupportedRuleError("play requirement without subject or condition");
      }
      const appliesToSource = resolveGrandArchiveSubjectObjects(
        effect.subject,
        abilityEvaluation,
      ).some((object) => object.id === abilityEvaluation.sourceId);
      if (appliesToSource && !evaluateGrandArchiveCondition(effect.condition, abilityEvaluation)) {
        throw new Error("The card does not satisfy its printed play restrictions");
      }
    }
  }
}

/** Enforces requirements printed specifically for bestowing the source boon. */
export function assertGrandArchiveBestowRestrictions(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  evaluation: GrandArchiveEvaluationContext,
): void {
  for (const ability of activeAbilities(face, evaluation)) {
    if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
    const abilityEvaluation = withGrandArchiveDerivedVariables(ability.variables, evaluation);
    if (!staticRestrictionsSatisfied(ability, abilityEvaluation)) continue;
    for (const effect of ability.effects) {
      if (
        effect.kind !== "rule-modification" ||
        effect.mode !== "require" ||
        effect.action !== "bestow"
      ) {
        continue;
      }
      if (!effect.subject || !effect.condition) {
        throw new GrandArchiveUnsupportedRuleError(
          "bestowment requirement without subject or condition",
        );
      }
      const appliesToSource = resolveGrandArchiveSubjectObjects(
        effect.subject,
        abilityEvaluation,
      ).some((object) => object.id === abilityEvaluation.sourceId);
      if (appliesToSource && !evaluateGrandArchiveCondition(effect.condition, abilityEvaluation)) {
        throw new Error("The boon does not satisfy its printed bestowment restrictions");
      }
    }
  }
}

function applyAbilityModifier(
  resolution: GrandArchiveCardResolution,
  modifier: GrandArchiveAbilityModifier,
): GrandArchiveCardResolution {
  const operation = modifier.operation;
  switch (operation.kind) {
    case "append-effect":
      return {
        ...resolution,
        effect: {
          kind: "sequence",
          effects: [
            resolution.effect,
            applyGrandArchiveInlineRestrictions(modifier, operation.effect),
          ],
        },
      };
    case "replace-effect":
      return {
        ...resolution,
        effect: applyGrandArchiveInlineRestrictions(modifier, operation.effect),
      };
    case "repeat-effect":
      return {
        ...resolution,
        effect: {
          kind: "sequence",
          effects: [
            resolution.effect,
            applyGrandArchiveInlineRestrictions(modifier, {
              kind: "repeat",
              count: operation.additionalTimes,
              effect:
                resolution.effect.kind === "repeat" ? resolution.effect.effect : resolution.effect,
            }),
          ],
        },
      };
  }
}

function foldAbilityModifiers(
  abilities: readonly GrandArchiveExecutableAbility[],
  evaluation: GrandArchiveEvaluationContext,
  resolutions: readonly GrandArchiveCardResolution[],
): readonly GrandArchiveCardResolution[] {
  const folded: GrandArchiveCardResolution[] = [];
  const remaining = new Map<string, GrandArchiveCardResolution[]>();
  for (const resolution of resolutions) {
    const entries = remaining.get(resolution.id) ?? [];
    entries.push(resolution);
    remaining.set(resolution.id, entries);
  }
  let last: GrandArchiveCardResolution | undefined;
  for (const ability of abilities) {
    if (ability.kind === "card-resolution") {
      const current = remaining.get(ability.id)?.shift();
      if (current) {
        last = current;
        folded.push(current);
      } else last = undefined;
      continue;
    }
    if (ability.kind !== "ability-modifier" || !last) continue;
    if (ability.modifies.kind !== "preceding-non-modifier-ability") continue;
    if (!staticRestrictionsSatisfied(ability, evaluation)) continue;
    if (ability.when && !evaluateGrandArchiveCondition(ability.when, evaluation)) continue;
    last = applyAbilityModifier(last, ability);
    folded[folded.length - 1] = last;
  }
  return folded;
}

function combinedAdditionalCost(
  resolutions: readonly GrandArchiveCardResolution[],
): GrandArchiveAbilityCost | undefined {
  const costs = resolutions.flatMap((resolution) =>
    resolution.additionalCost ? [resolution.additionalCost] : [],
  );
  const first = costs[0];
  if (!first) return undefined;
  return costs.length === 1 ? first : { kind: "all", costs: [first, ...costs.slice(1)] };
}

function nonEmpty<T>(values: readonly T[]): readonly [T, ...T[]] | undefined {
  const first = values[0];
  return first === undefined ? undefined : [first, ...values.slice(1)];
}

function combineCardResolutions(
  resolutions: readonly GrandArchiveCardResolution[],
): GrandArchiveCardResolution | undefined {
  if (resolutions.length === 0) return undefined;
  if (resolutions.length === 1) return resolutions[0];
  const explicitModes = resolutions.flatMap((resolution) =>
    resolution.modes ? [resolution.modes] : [],
  );
  if (explicitModes.length > 1) {
    throw new GrandArchiveUnsupportedRuleError("multiple active card-resolution mode declarations");
  }
  const activationRules = resolutions.flatMap((resolution) => resolution.activationRules ?? []);
  const nonEmptyActivationRules = nonEmpty(activationRules);
  const additionalCost = combinedAdditionalCost(resolutions);
  const targets = resolutions.flatMap((resolution) => resolution.targets ?? []);
  const variables = resolutions.flatMap((resolution) => resolution.variables ?? []);
  const effects = resolutions.map((resolution) =>
    applyGrandArchiveInlineRestrictions(
      resolution,
      resolution.condition
        ? {
            kind: "conditional" as const,
            condition: resolution.condition,
            then: resolution.effect,
          }
        : resolution.effect,
    ),
  );
  const firstEffect = effects[0];
  if (!firstEffect) return undefined;
  return {
    id: resolutions[0]!.id,
    kind: "card-resolution",
    text: resolutions.map((resolution) => resolution.text).join("\n\n"),
    ...(additionalCost ? { additionalCost } : {}),
    ...(nonEmptyActivationRules ? { activationRules: nonEmptyActivationRules } : {}),
    ...(targets.length > 0 ? { targets } : {}),
    ...(variables.length > 0 ? { variables } : {}),
    ...(explicitModes[0] ? { modes: explicitModes[0] } : {}),
    effect: {
      kind: "sequence",
      effects: [firstEffect, ...effects.slice(1)],
    },
  };
}

export function captureGrandArchiveCardResolutionAbilities(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  evaluation: GrandArchiveEvaluationContext,
): readonly {
  readonly ability: GrandArchiveCardResolution;
  readonly enabled: boolean;
}[] {
  return activeAbilities(face, evaluation).flatMap((ability) =>
    ability.kind === "card-resolution"
      ? [{ ability, enabled: staticRestrictionsSatisfied(ability, evaluation) }]
      : [],
  );
}

/**
 * Composes the paragraphs that remain enabled as resolution begins. Costs,
 * modes, variables, and targets were fixed at announcement, but restriction
 * abilities can enable or disable their corresponding effects before the card
 * resolves (Comprehensive Rules, Elysian Aura 3.1).
 */
export function composeGrandArchivePendingCardResolution(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  evaluation: GrandArchiveEvaluationContext,
  announcement: readonly {
    readonly ability: GrandArchiveCardResolution;
    readonly enabled: boolean;
  }[],
  options: { readonly reevaluateStaticRestrictions?: boolean } = {},
): GrandArchiveCardResolution | undefined {
  const announcedById = new Map<
    string,
    { ability: GrandArchiveCardResolution; enabled: boolean }[]
  >();
  for (const entry of announcement) {
    const entries = announcedById.get(entry.ability.id) ?? [];
    entries.push(entry);
    announcedById.set(entry.ability.id, entries);
  }
  const resolutions: GrandArchiveCardResolution[] = [];
  const resolutionTimeAdditions: GrandArchiveCardResolution[] = [];
  for (const ability of activeAbilities(face, evaluation)) {
    if (ability.kind !== "card-resolution") continue;
    const announced = announcedById.get(ability.id)?.shift();
    if (announced) {
      const enabled = options.reevaluateStaticRestrictions
        ? staticRestrictionsSatisfied(announced.ability, evaluation)
        : announced.enabled;
      if (enabled) {
        resolutions.push(announced.ability);
        if (!announced.enabled) resolutionTimeAdditions.push(announced.ability);
      }
      continue;
    }
    if (staticRestrictionsSatisfied(ability, evaluation)) {
      resolutions.push(ability);
      resolutionTimeAdditions.push(ability);
    }
  }
  if (
    resolutionTimeAdditions.some(
      (ability) =>
        ability.additionalCost !== undefined ||
        ability.activationRules !== undefined ||
        ability.targets !== undefined ||
        ability.variables !== undefined ||
        ability.modes !== undefined,
    )
  ) {
    throw new GrandArchiveUnsupportedRuleError(
      "pending card-resolution additions requiring announcement",
    );
  }
  return combineCardResolutions(
    foldAbilityModifiers(activeAbilities(face, evaluation), evaluation, resolutions),
  );
}

/**
 * Builds the complete resolving instructions printed on a card, omitting only
 * paragraphs disabled by static restrictions such as Class or Champion Bonus.
 */
export function composeGrandArchiveCardResolution(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveCardResolution | undefined {
  const resolutions = captureGrandArchiveCardResolutionAbilities(face, evaluation).flatMap(
    (entry) => (entry.enabled ? [entry.ability] : []),
  );
  return combineCardResolutions(resolutions);
}
