import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import type { Trigger } from "@lorcanito/lorcana-engine/abilities/triggers";
import type { CardEffectTarget, EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { CardRestrictionEffect, Effect, PlayerRestrictionEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import type { TargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";
export type AbilityTypes = "singer" | "shift" | "resist" | "challenger" | "reverse-challenger" | "bodyguard" | "rush" | "reckless" | "evasive" | "support" | "voiceless" | "ward" | "gain-ability" | "sing-together" | "effects" | "play-condition" | "challenge-ready-chars" | "challenge-ready-damaged-chars" | "restriction" | "player-restriction" | "protector" | "vanish" | "meta";
export declare function exertCharCost(amount: number): {
    type: "card";
    action: "discard" | "exert" | "banish";
    amount: number;
    filters: TargetFilter[];
};
export declare function discardCharCost(amount: number): {
    type: "card";
    action: "discard" | "exert" | "banish";
    amount: number;
    filters: TargetFilter[];
};
export declare function banishItemCost(amount: number): {
    type: "card";
    action: "discard" | "exert" | "banish";
    amount: number;
    filters: TargetFilter[];
};
export declare function exertItemCost(amount: number): {
    type: "card";
    action: "discard" | "exert" | "banish";
    amount: number;
    filters: TargetFilter[];
};
export type CardCost = {
    type: "card";
    action: "discard" | "exert" | "banish";
    amount: number;
    filters: TargetFilter[];
};
export type Cost = {
    type: "exert";
} | {
    type: "banish";
} | {
    type: "ink";
    amount: number;
} | CardCost;
export type Ability = ResolutionAbility | ActivatedAbility | StaticAbility | TriggeredAbility | FloatingTriggeredAbility | PlayConditionAbility;
export interface BaseAbility {
    type?: "resolution" | "activated" | "static" | "static-triggered" | "floating-triggered" | "play-condition";
    target?: EffectTargets;
    effects?: Effect[];
    responder?: "self" | "opponent";
    text?: string;
    name?: string;
    nameACard?: boolean;
    conditions?: Condition[];
    costs?: Cost[];
    optional?: boolean;
    accepted?: boolean;
    resolveEffectsIndividually?: boolean;
    resolveAmountBeforeCreatingLayer?: boolean;
    detrimental?: boolean;
    dependentEffects?: boolean;
    isPrivate?: boolean;
    oncePerTurn?: boolean;
    unless?: boolean;
}
export interface PlayConditionAbility extends BaseAbility {
    type: "play-condition";
    conditions: Condition[];
    name?: string;
}
export interface ResolutionAbility extends BaseAbility {
    type: "resolution";
    resolutionConditions?: Condition[];
    name?: string;
    effects: Effect[];
    costs?: Cost[];
    onCancelLayer?: Omit<ResolutionAbility, "onCancelLayer" | "optional">;
}
export interface ActivatedAbility extends BaseAbility {
    type: "activated";
    effects: Effect[];
    oncePerTurn?: boolean;
    costs: Cost[];
}
export interface StaticAbilityWithAbility extends BaseAbility {
    type: "static";
    ability: AbilityTypes;
    value?: number | DynamicAmount;
}
export interface StaticAbilityWithEffect extends BaseAbility {
    type: "static";
    ability: "effects";
    effects: Effect[];
    value?: number | DynamicAmount;
}
export type StaticAbility = StaticAbilityWithAbility | StaticAbilityWithEffect | ShiftAbility | GainAbilityStaticAbility;
export interface TriggeredAbility extends BaseAbility {
    type: "static-triggered";
    trigger: Trigger;
    secondaryConditions?: Condition[];
    layer: ResolutionAbility;
}
export interface FloatingTriggeredAbility extends BaseAbility {
    type: "floating-triggered";
    trigger: Trigger;
    duration: "turn" | "next_turn" | number;
    layer: ResolutionAbility;
}
export interface SingerAbility extends StaticAbilityWithAbility {
    ability: "singer";
    type: "static";
    value: number;
}
export interface SingTogetherAbility extends StaticAbilityWithAbility {
    ability: "sing-together";
    type: "static";
    value: number;
}
export declare const singerAbility: (value: number) => SingerAbility;
export declare const singerTogetherAbility: (value: number) => SingTogetherAbility;
export interface ResistAbility extends StaticAbilityWithAbility {
    type: "static";
    ability: "resist";
    value: number | DynamicAmount;
    onlyWhileChallenge?: boolean;
}
export declare const resistAbility: (value: number | DynamicAmount, onlyWhileChallenge?: boolean) => ResistAbility;
export interface GainAbilityStaticAbility extends StaticAbilityWithAbility {
    type: "static";
    ability: "gain-ability";
    target: CardEffectTarget;
    gainedAbility: StaticAbility | ActivatedAbility | TriggeredAbility | ResolutionAbility;
}
export interface EffectStaticAbility extends StaticAbilityWithAbility {
    type: "static";
    ability: "effects";
    effects: Effect[];
}
export interface RestrictionStaticAbility extends StaticAbilityWithAbility {
    type: "static";
    ability: "restriction";
    effect: CardRestrictionEffect;
    target: CardEffectTarget;
}
export interface PlayerRestrictionStaticAbility extends StaticAbilityWithAbility {
    type: "static";
    ability: "player-restriction";
    effect: PlayerRestrictionEffect;
}
export interface ShiftAbility extends StaticAbilityWithAbility {
    ability: "shift";
    costs: Cost[];
    additionalNames?: string[];
}
export declare const shiftAbility: (shift: number | Cost[], name: string | string[], text?: string) => ShiftAbility;
export declare const challengerAbility: (value: number) => ChallengerAbility;
export interface VoicelessAbility extends StaticAbilityWithAbility {
    ability: "voiceless";
    type: "static";
}
export declare const voicelessAbility: VoicelessAbility;
export interface ChallengerAbility extends StaticAbilityWithAbility {
    ability: "challenger";
    value: number;
}
export interface ReverseChallengerAbility extends StaticAbilityWithAbility {
    ability: "reverse-challenger";
    value: number;
}
export interface RushAbility extends StaticAbilityWithAbility {
    ability: "rush";
    type: "static";
}
export declare const rushAbility: RushAbility;
export interface RecklessAbility extends StaticAbilityWithAbility {
    ability: "reckless";
    type: "static";
}
export declare const recklessAbility: RecklessAbility;
export interface EvasiveAbility extends StaticAbilityWithAbility {
    ability: "evasive";
    type: "static";
}
export declare const evasiveAbility: EvasiveAbility;
export interface SupportAbility extends StaticAbilityWithAbility {
    ability: "support";
    type: "static";
}
export declare const supportAbility: SupportAbility;
export interface WardAbility extends StaticAbilityWithAbility {
    ability: "ward";
    type: "static";
}
export declare const wardAbility: WardAbility;
export interface VanishAbility extends StaticAbilityWithAbility {
    ability: "vanish";
    type: "static";
}
export interface MetaAbility extends StaticAbilityWithAbility {
    type: "static";
    ability: "meta";
    alternativeCosts?: Cost[];
}
export declare const metaAbility: ({ text, name, }: {
    text: string;
    name: string;
}) => MetaAbility;
export declare const vanishAbility: VanishAbility;
export interface BodyGuardAbility extends StaticAbilityWithAbility {
    ability: "bodyguard";
    type: "static";
}
export declare const bodyguardAbility: BodyGuardAbility;
export declare const challengeReadyCharacters: StaticAbility;
export declare const protectorAbility: StaticAbility;
export declare const duringYourTurnWheneverBanishesCharacterInChallenge: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
}) => TriggeredAbility;
export declare const duringYourTurnWheneverBanishesItem: (params: {
    effects: Effect[];
    target?: EffectTargets;
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
}) => TriggeredAbility;
export declare const duringYourTurnGains: (name: string, text: string, ability: StaticAbility) => GainAbilityStaticAbility;
export declare const duringYourTurnThisCharacterGains: ({ name, text, ability, conditions, }: {
    name: string;
    text: string;
    ability: StaticAbility;
    conditions: Condition[];
}) => GainAbilityStaticAbility;
export declare function targetCharacterGains(params: {
    gainedAbility: GainAbilityStaticAbility["gainedAbility"];
    target: GainAbilityStaticAbility["target"];
    name: string;
    text: string;
    conditions?: Condition[];
}): GainAbilityStaticAbility;
export declare const yourOtherCharactersWithGain: (params: {
    gainedAbility: StaticAbility;
    filter: TargetFilter;
    name: string;
    text: string;
}) => GainAbilityStaticAbility;
export declare const chosenCharacterGains: (params: {
    gainedAbility: StaticAbility;
    name: string;
    text: string;
}) => GainAbilityStaticAbility;
export declare const otherCharacterGains: (params: {
    gainedAbility: StaticAbility;
    name: string;
    text: string;
}) => GainAbilityStaticAbility;
export declare const madameMimAbility: ResolutionAbility;
export declare function moveDamageAbility(params: {
    amount: number | DynamicAmount;
    from: CardEffectTarget;
    to: CardEffectTarget;
    optional?: boolean;
}): ResolutionAbility;
export declare function gainAbilityWhileHere({ ability, name, text, target, conditions, }: {
    ability: GainAbilityStaticAbility["gainedAbility"];
    name: GainAbilityStaticAbility["name"];
    text: GainAbilityStaticAbility["text"];
    conditions?: GainAbilityStaticAbility["conditions"];
    target?: GainAbilityStaticAbility["target"];
}): GainAbilityStaticAbility;
export declare const foodFightAbility: ActivatedAbility;
export declare function reverseChallenge(name: string, value: number): ReverseChallengerAbility;
export declare function charactersWithCostXorLessCantChallenge({ cost, name, text, }: {
    cost: number;
    name: string;
    text: string;
}): StaticAbility;
export declare function yourOtherCharactersGet({ name, text, effects, }: {
    name: string;
    text: string;
    effects: Effect[];
}): StaticAbilityWithEffect;
export declare const chosenExertedCharacterCantReadyWhileThisIsInPlace: ResolutionAbility;
export declare function yourCharactersNamedGain({ name, ability, excludeSelf, }: {
    name: string;
    ability: GainAbilityStaticAbility["gainedAbility"];
    excludeSelf?: boolean;
}): GainAbilityStaticAbility;
export declare const atEndOfTurnBanishItself: TriggeredAbility;
//# sourceMappingURL=abilities.d.ts.map