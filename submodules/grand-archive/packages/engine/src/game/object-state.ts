import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveEvaluationContext } from "../procedures/effects/evaluation.ts";
import {
  deriveGrandArchiveCharacteristics,
  grandArchiveObjectCurrentCharacteristics,
} from "../rules/state/continuous.ts";
import type { GrandArchiveObjectState } from "@tcg/grand-archive-types";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "./model.ts";

const ACTIVATION_BACKED_OBJECT_STATES = ["brewed", "imbued", "prepared"] as const;

/**
 * Reads a rules state from its authoritative property. Awake is the default
 * orientation; Damaged, Loaded, Brewed, Imbued, and Prepared are derived
 * rather than independently persisted flags.
 */
export function grandArchiveObjectHasState(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  queriedState: GrandArchiveObjectState,
  context?: GrandArchiveEvaluationContext,
): boolean {
  switch (queriedState) {
    case "awake":
      return !object.states.has("rested");
    case "damaged":
      return grandArchiveObjectMarkedDamage(program, state, object, context) > 0;
    case "loaded":
      return Object.values(state.objects).some(
        (candidate) => candidate.zone === "loaded" && candidate.hostId === object.id,
      );
    case "brewed":
    case "imbued":
    case "prepared":
      return object.activationStates.has(queriedState) || object.states.has(queriedState);
    case "attacking":
    case "defending":
    case "distant":
    case "ephemeral":
    case "fostered":
    case "intercepting":
    case "preserved":
    case "rested":
    case "retaliating":
    case "wielded":
      return object.states.has(queriedState);
  }
}

/** Complete rules-facing state set used by projections and automation. */
export function grandArchiveObjectEffectiveStates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): ReadonlySet<GrandArchiveObjectState> {
  const effective = new Set(object.states);
  effective.delete("awake");
  if (!object.states.has("rested")) effective.add("awake");
  if (grandArchiveObjectMarkedDamage(program, state, object) > 0) effective.add("damaged");
  else effective.delete("damaged");
  if (
    Object.values(state.objects).some(
      (candidate) => candidate.zone === "loaded" && candidate.hostId === object.id,
    )
  ) {
    effective.add("loaded");
  } else {
    effective.delete("loaded");
  }
  for (const activationState of ACTIVATION_BACKED_OBJECT_STATES) {
    if (object.activationStates.has(activationState)) effective.add(activationState);
  }
  return effective;
}

export function grandArchiveStateUsesActivationProperty(
  state: GrandArchiveObjectState,
): state is "brewed" | "imbued" | "prepared" {
  return state === "brewed" || state === "imbued" || state === "prepared";
}

/** The damage that matters to the object's current functional type. */
export function grandArchiveObjectMarkedDamage(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  context?: GrandArchiveEvaluationContext,
): number {
  if (object.damage === 0 && object.temporaryDamage === 0) return 0;
  const types = (
    context
      ? deriveGrandArchiveCharacteristics(object, context)
      : grandArchiveObjectCurrentCharacteristics(program, state, object)
  ).types;
  return types.includes("CHAMPION")
    ? object.damage
    : types.includes("ALLY")
      ? object.temporaryDamage
      : 0;
}
