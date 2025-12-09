import type { Ability, ActivatedAbility, BodyGuardAbility, CardCost, ChallengerAbility, Cost, EffectStaticAbility, EvasiveAbility, FloatingTriggeredAbility, GainAbilityStaticAbility, MetaAbility, PlayerRestrictionStaticAbility, RecklessAbility, ResistAbility, ResolutionAbility, RestrictionStaticAbility, ReverseChallengerAbility, RushAbility, ShiftAbility, SingerAbility, SingTogetherAbility, StaticAbility, SupportAbility, TriggeredAbility, VanishAbility, VoicelessAbility, WardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { Effect } from "@lorcanito/lorcana-engine/effects/effectTypes";
export declare const staticEffectAbilityPredicate: (ability?: Ability) => ability is EffectStaticAbility;
export declare const gainStaticAbilityPredicate: (ability?: Ability) => ability is GainAbilityStaticAbility;
export declare const restrictionStaticAbilityPredicate: (ability?: Ability) => ability is RestrictionStaticAbility;
export declare const alternateCostAbilityPredicate: (ability?: Ability) => ability is MetaAbility & {
    alternativeCosts: Cost[];
};
export declare const playerRestrictionPredicate: (ability?: Ability) => ability is PlayerRestrictionStaticAbility;
export declare const singleEffectAbility: (ability?: Ability) => ability is Ability & {
    effect: Effect;
};
export declare const staticAbilityPredicate: (ability?: Ability | unknown) => ability is StaticAbility;
export declare const singerStaticAbilityPredicate: (ability?: Ability) => ability is SingerAbility;
export declare const staticTriggeredAbilityPredicate: (ability?: Ability) => ability is TriggeredAbility;
export declare const delayedTriggeredAbilityPredicate: (ability?: Ability) => ability is FloatingTriggeredAbility;
export declare const challengerAbilityPredicate: (ability?: Ability) => ability is ChallengerAbility;
export declare const reverseChallengerAbilityPredicate: (ability?: Ability) => ability is ReverseChallengerAbility;
export declare const recklessAbilityPredicate: (ability?: Ability) => ability is RecklessAbility;
export declare const singerAbilityPredicate: (ability?: Ability) => ability is SingerAbility;
export declare const metaAbilityPredicate: (ability?: Ability) => ability is MetaAbility;
export declare const voicelessAbilityPredicate: (ability?: Ability) => ability is VoicelessAbility;
export declare const evasiveAbilityPredicate: (ability?: Ability) => ability is EvasiveAbility;
export declare const wardAbilityPredicate: (ability?: Ability) => ability is WardAbility;
export declare const vanishAbilityPredicate: (ability?: Ability) => ability is VanishAbility;
export declare const shiftAbilityPredicate: (ability?: Ability | undefined | unknown) => ability is ShiftAbility;
export declare const bodyguardAbilityPredicate: (ability?: Ability) => ability is BodyGuardAbility;
export declare const supportAbilityPredicate: (ability?: Ability) => ability is SupportAbility;
export declare const singTogetherAbilityPredicate: (ability?: Ability) => ability is SingTogetherAbility;
export declare const resistAbilityPredicate: (ability?: Ability) => ability is ResistAbility;
export declare const protectorAbilityPredicate: (ability?: Ability) => ability is StaticAbility & {
    ability: "protector";
};
export declare const rushAbilityPredicate: (ability?: Ability) => ability is RushAbility;
export declare const resolutionAbilityPredicate: (ability?: Ability) => ability is ResolutionAbility;
export declare const activatedAbilityPredicate: (ability?: Ability) => ability is ActivatedAbility;
export declare const cardCostPredicate: (cost: Cost | undefined) => cost is CardCost;
export declare function notEmptyPredicate<TValue>(value: TValue | null | undefined): value is TValue;
//# sourceMappingURL=abilityTypeGuards.d.ts.map