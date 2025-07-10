import type {
  Ability,
  ActivatedAbility,
  BodyGuardAbility,
  CardCost,
  ChallengerAbility,
  Cost,
  EffectStaticAbility,
  EvasiveAbility,
  FloatingTriggeredAbility,
  GainAbilityStaticAbility,
  MetaAbility,
  PlayerRestrictionStaticAbility,
  RecklessAbility,
  ResistAbility,
  ResolutionAbility,
  RestrictionStaticAbility,
  ReverseChallengerAbility,
  RushAbility,
  ShiftAbility,
  SingerAbility,
  SingTogetherAbility,
  StaticAbility,
  SupportAbility,
  TriggeredAbility,
  VanishAbility,
  VoicelessAbility,
  WardAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { Effect } from "@lorcanito/lorcana-engine/effects/effectTypes";

export const staticEffectAbilityPredicate = (
  ability?: Ability,
): ability is EffectStaticAbility =>
  staticAbilityPredicate(ability) && ability.ability === "effects";
export const gainStaticAbilityPredicate = (
  ability?: Ability,
): ability is GainAbilityStaticAbility =>
  ability?.type === "static" && ability.ability === "gain-ability";

export const restrictionStaticAbilityPredicate = (
  ability?: Ability,
): ability is RestrictionStaticAbility =>
  staticAbilityPredicate(ability) && ability?.ability === "restriction";

export const alternateCostAbilityPredicate = (
  ability?: Ability,
): ability is MetaAbility & { alternativeCosts: Cost[] } =>
  staticAbilityPredicate(ability) &&
  ability?.ability === "meta" &&
  "alternativeCosts" in ability;

export const playerRestrictionPredicate = (
  ability?: Ability,
): ability is PlayerRestrictionStaticAbility =>
  ability?.type === "static" && ability.ability === "player-restriction";
// TODO: I should probably get rid of this type of effect, it just complicate things
export const singleEffectAbility = (
  ability?: Ability,
): ability is Ability & { effect: Effect } => "effect" in (ability || {});

// TODO: there's static abilities with only effects
export const staticAbilityPredicate = (
  ability?: Ability | unknown,
): ability is StaticAbility => {
  if (!ability || typeof ability !== "object") {
    return false;
  }

  if (!("type" in ability)) {
    return false;
  }

  return ability?.type === "static";
};
export const singerStaticAbilityPredicate = (
  ability?: Ability,
): ability is SingerAbility =>
  staticAbilityPredicate(ability) && ability.ability === "singer";
export const staticTriggeredAbilityPredicate = (
  ability?: Ability,
): ability is TriggeredAbility => ability?.type === "static-triggered";
export const delayedTriggeredAbilityPredicate = (
  ability?: Ability,
): ability is FloatingTriggeredAbility =>
  ability?.type === "floating-triggered";
export const challengerAbilityPredicate = (
  ability?: Ability,
): ability is ChallengerAbility =>
  staticAbilityPredicate(ability) && ability.ability === "challenger";
export const reverseChallengerAbilityPredicate = (
  ability?: Ability,
): ability is ReverseChallengerAbility =>
  staticAbilityPredicate(ability) && ability.ability === "reverse-challenger";
export const recklessAbilityPredicate = (
  ability?: Ability,
): ability is RecklessAbility =>
  staticAbilityPredicate(ability) && ability.ability === "reckless";
export const singerAbilityPredicate = (
  ability?: Ability,
): ability is SingerAbility =>
  staticAbilityPredicate(ability) && ability.ability === "singer";
export const metaAbilityPredicate = (
  ability?: Ability,
): ability is MetaAbility =>
  staticAbilityPredicate(ability) && ability.ability === "meta";
export const voicelessAbilityPredicate = (
  ability?: Ability,
): ability is VoicelessAbility =>
  staticAbilityPredicate(ability) && ability.ability === "voiceless";
export const evasiveAbilityPredicate = (
  ability?: Ability,
): ability is EvasiveAbility =>
  staticAbilityPredicate(ability) && ability.ability === "evasive";
export const wardAbilityPredicate = (
  ability?: Ability,
): ability is WardAbility =>
  staticAbilityPredicate(ability) && ability.ability === "ward";
export const vanishAbilityPredicate = (
  ability?: Ability,
): ability is VanishAbility =>
  staticAbilityPredicate(ability) && ability.ability === "vanish";
export const shiftAbilityPredicate = (
  ability?: Ability | undefined | unknown,
): ability is ShiftAbility => {
  return staticAbilityPredicate(ability) && ability.ability === "shift";
};
export const bodyguardAbilityPredicate = (
  ability?: Ability,
): ability is BodyGuardAbility =>
  staticAbilityPredicate(ability) && ability.ability === "bodyguard";
export const supportAbilityPredicate = (
  ability?: Ability,
): ability is SupportAbility =>
  staticAbilityPredicate(ability) && ability.ability === "support";
export const singTogetherAbilityPredicate = (
  ability?: Ability,
): ability is SingTogetherAbility =>
  staticAbilityPredicate(ability) && ability.ability === "sing-together";
export const resistAbilityPredicate = (
  ability?: Ability,
): ability is ResistAbility =>
  staticAbilityPredicate(ability) && ability.ability === "resist";
export const protectorAbilityPredicate = (
  ability?: Ability,
): ability is StaticAbility & { ability: "protector" } =>
  staticAbilityPredicate(ability) && ability.ability === "protector";
export const rushAbilityPredicate = (
  ability?: Ability,
): ability is RushAbility =>
  staticAbilityPredicate(ability) && ability.ability === "rush";
export const resolutionAbilityPredicate = (
  ability?: Ability,
): ability is ResolutionAbility => ability?.type === "resolution";
export const activatedAbilityPredicate = (
  ability?: Ability,
): ability is ActivatedAbility => ability?.type === "activated";
export const cardCostPredicate = (cost: Cost | undefined): cost is CardCost =>
  cost?.type === "card";

export function notEmptyPredicate<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}
