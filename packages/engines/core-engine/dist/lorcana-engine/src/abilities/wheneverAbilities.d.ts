import type { CardEffectTarget, Cost, Effect, TargetFilter, TriggeredAbility, Zones } from "@lorcanito/lorcana-engine";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
export declare const wheneverIsExerted: (params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: Effect[];
    target: CardEffectTarget;
}) => TriggeredAbility;
export declare const wheneverIsReturnedToHand: (params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: Effect[];
    target: CardEffectTarget;
    from?: Zones;
}) => TriggeredAbility;
export declare const wheneverACardIsPutIntoYourInkwell: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    oncePerTurn?: boolean;
    conditions?: Condition[];
    responder?: "self" | "opponent";
    costs?: Cost[];
    resolveEffectsIndividually?: boolean;
}) => TriggeredAbility;
export declare const wheneverOneOfYourCharactersIsBanishedInAChallenge: (params: {
    effects: Effect[];
    target?: EffectTargets;
    triggerFilter?: TargetFilter[];
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverBanishesAnotherCharacterInChallenge: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
}) => TriggeredAbility;
export declare const wheneverAnotherCharIsBanished: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
}) => TriggeredAbility;
export declare const wheneverAnotherCharIsBanishedInChallenge: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
}) => TriggeredAbility;
export declare const wheneverOpposingCharIsBanishedInChallenge: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
    costs?: Cost[];
}) => TriggeredAbility;
export declare const wheneverOpposingCharIsBanished: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverYouPlayAFloodBorn: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    excludeSelf?: boolean;
    responder?: "opponent";
    hasShifted?: boolean;
    costs?: Cost[];
}) => TriggeredAbility;
export declare const wheneverYouPlayACharacter: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    excludeSelf?: boolean;
    responder?: "opponent";
    hasShifted?: boolean;
    costs?: Cost[];
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverYouPlayAnotherCharacter: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    responder?: "opponent";
    hasShifted?: boolean;
    costs?: Cost[];
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverOneOfYouCharactersIsBanished: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
    triggerTarget?: TargetFilter[];
}) => TriggeredAbility;
export declare const wheneverThisCharacterDealsDamageInChallenge: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverOneOfYourCharChallengesAnotherCharOrLocation: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    defenderFilter?: TargetFilter[];
    attackerFilter?: TargetFilter[];
}) => TriggeredAbility;
export declare const wheneverChallengesAnotherChar: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    defenderFilter?: TargetFilter[];
    attackerFilters?: TargetFilter[];
}) => TriggeredAbility;
export declare const wheneverACharacterQuests: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    characterFilter: TargetFilter[];
    dependentEffects?: boolean;
    resolveEffectsIndividually?: boolean;
}) => TriggeredAbility;
export declare function wheneverACharacterQuestsWhileHere(params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    dependentEffects?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
    conditions?: Condition[];
}): import("@lorcanito/lorcana-engine").GainAbilityStaticAbility;
export declare function wheneverOneOfYourCharsQuests(params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    dependentEffects?: boolean;
    resolveEffectsIndividually?: boolean;
    conditions?: Condition[];
}): TriggeredAbility;
export declare const wheneverQuests: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    dependentEffects?: boolean;
    resolveEffectsIndividually?: boolean;
    conditions?: Condition[];
    costs?: Cost[];
    triggerTarget?: CardEffectTarget;
    nameACard?: boolean;
}) => TriggeredAbility;
export declare const wheneverThisCharacterQuests: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    dependentEffects?: boolean;
    resolveEffectsIndividually?: boolean;
    conditions?: Condition[];
    costs?: Cost[];
    triggerTarget?: CardEffectTarget;
    nameACard?: boolean;
}) => TriggeredAbility;
export declare const wheneverOneOfYourCharactersSings: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    dependentEffects?: boolean;
    resolveEffectsIndividually?: boolean;
    oncePerTurn?: boolean;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverThisCharSings: (params: {
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    dependentEffects?: boolean;
    resolveEffectsIndividually?: boolean;
}) => TriggeredAbility;
export declare const wheneverYouDiscardACard: (params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: Effect[];
}) => TriggeredAbility;
export declare const wheneverYourOpponentDiscardsOneOrMore: (params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: Effect[];
}) => TriggeredAbility;
export declare const wheneverYouDrawACard: (params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: Effect[];
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverOpponentDrawsACard: (params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: Effect[];
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverYouHeal: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
}) => TriggeredAbility;
export declare const wheneverYouHealAnyCharacter: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
}) => TriggeredAbility;
export declare const wheneverThisCharIsDamaged: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
}) => TriggeredAbility;
export declare const wheneverOppCharIsDamaged: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    oncePerTurn?: boolean;
    detrimental?: boolean;
    resolveEffectsIndividually?: boolean;
    costs?: Cost[];
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverOneOfYourCharChallengesAnotherChar: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    conditions?: TriggeredAbility["conditions"];
    defenderFilter?: TargetFilter[];
    attackerFilter?: TargetFilter[];
}) => TriggeredAbility;
export declare const wheneverTargetPlays: (params: {
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
    hasShifted?: boolean;
    hasSang?: boolean;
    conditions?: Condition[];
    oncePerTurn?: boolean;
}) => TriggeredAbility;
export declare const wheneverYouPlayAnItem: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    responder?: "opponent";
}) => TriggeredAbility;
export declare const wheneverOpponentPlaysASong: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    responder?: "opponent";
}) => TriggeredAbility;
export declare const wheneverYouPlayASong: (params: {
    effects: Effect[];
    target?: EffectTargets;
    resolveEffectsIndividually?: boolean;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    responder?: "opponent";
    oncePerTurn?: boolean;
}) => TriggeredAbility;
export declare const wheneverOneOrMoreOfYourCharSingsASong: (params: {
    effects: Effect[];
    target?: EffectTargets;
    resolveEffectsIndividually?: boolean;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    responder?: "opponent";
    oncePerTurn?: boolean;
    conditions?: Condition[];
}) => TriggeredAbility;
export declare const wheneverYouPlayAnActionNotASong: (params: {
    effects: Effect[];
    target?: EffectTargets;
    resolveEffectsIndividually?: boolean;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    responder?: "opponent";
}) => TriggeredAbility;
export declare const wheneverYouPlayAnAction: (params: {
    effects: Effect[];
    target?: EffectTargets;
    resolveEffectsIndividually?: boolean;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    responder?: "opponent";
}) => TriggeredAbility;
export declare const wheneverYouPlayALocation: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    responder?: "opponent";
}) => TriggeredAbility;
export declare const wheneverYouPlayAnotherPrincess: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    responder?: "opponent";
}) => TriggeredAbility;
export declare const wheneverPlays: (params: {
    triggerTarget: CardEffectTarget;
    effects: Effect[];
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    costs?: Cost[];
    hasShifted?: boolean;
    responder?: "opponent";
    conditions?: Condition[];
    excludeSelf?: boolean;
}) => TriggeredAbility;
export declare function wheneverYouReadyThisCharacter({ name, text, conditions, effects, optional, unless, oncePerTurn, }: {
    name: string;
    text: string;
    conditions?: Condition[];
    effects: Effect[];
    optional?: boolean;
    unless?: boolean;
    oncePerTurn?: boolean;
}): TriggeredAbility;
//# sourceMappingURL=wheneverAbilities.d.ts.map