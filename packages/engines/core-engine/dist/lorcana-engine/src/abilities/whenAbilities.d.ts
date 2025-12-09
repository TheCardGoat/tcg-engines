import type { Ability, CardEffectTarget, Cost, DynamicAmount, Effect, ResolutionAbility, StaticAbility, TargetFilter, TriggeredAbility } from "@lorcanito/lorcana-engine";
import type { MovesToLocationTrigger } from "@lorcanito/lorcana-engine/abilities/triggers";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
export declare function whenYouMoveACharacterHere(params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: Effect[];
    target?: CardEffectTarget;
    conditions?: Condition[];
    movingFrom?: MovesToLocationTrigger["movingFrom"];
}): TriggeredAbility;
export declare const whenMovesToALocation: (params: {
    name: string;
    text: string;
    optional?: boolean;
    oncePerTurn?: boolean;
    effects: Effect[];
    conditions?: Condition[];
    target?: CardEffectTarget;
}) => TriggeredAbility;
export declare const whenPlayAndWhenLeaves: (params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: Effect[];
}) => Ability[];
export declare const whenThisCharChallengesAndIsBanished: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
}) => TriggeredAbility;
export declare const whenYourOtherCharactersIsBanished: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
    triggerTarget?: TargetFilter[];
}) => TriggeredAbility;
export declare const whenThisCharacterBanished: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const whenThisCharacterBanishedInAChallenge: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const whenChallengedAndBanished: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
}) => TriggeredAbility;
export declare const whenChallenged: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
}) => TriggeredAbility;
export declare const whenYouPlayThis: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    resolveEffectsIndividually?: boolean;
    dependentEffects?: boolean;
    conditions?: ResolutionAbility["resolutionConditions"];
}) => ResolutionAbility;
export declare const whenPlayAndWheneverQuests: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    resolveEffectsIndividually?: boolean;
    dependentEffects?: boolean;
}) => Ability[];
export declare const whenYouPlayMayDrawACard: ResolutionAbility;
export declare const whenPlayOnThisCard: (params: {
    effects: Effect[];
    target?: EffectTargets;
    triggerFilter?: TargetFilter[];
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    excludeSelf?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
    responder?: "opponent";
    conditions?: Condition[];
    shifterTargetFilters: TargetFilter[];
    shiftedTargetFilters: TargetFilter[];
}) => TriggeredAbility;
export declare const whenXIsBanished: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare function whenYouPlayThisCharacter(params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    resolveEffectsIndividually?: boolean;
    dependentEffects?: boolean;
    conditions?: ResolutionAbility["resolutionConditions"];
}): ResolutionAbility;
export declare function whenYouPlayThisForEachYouPayLess(params: {
    name?: string;
    text?: string;
    amount: DynamicAmount | number;
    conditions?: Condition[];
}): StaticAbility;
export declare function whenThisIsBanished({ name, text, effects, optional, }: {
    name: string;
    text: string;
    effects: Effect[];
    optional?: boolean;
}): TriggeredAbility;
export declare function whenYouPlayThisCharAbility(ability: ResolutionAbility): ResolutionAbility;
//# sourceMappingURL=whenAbilities.d.ts.map