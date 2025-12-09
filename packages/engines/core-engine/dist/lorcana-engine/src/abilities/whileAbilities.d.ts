import type { Ability, AttributeEffect, Effect, GainAbilityStaticAbility, LorcanitoCard, StaticAbility, TriggeredAbility } from "@lorcanito/lorcana-engine";
import type { ActivatedAbility, RestrictionStaticAbility, StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
export declare const whileCharacterIsAtLocationItGets: (params: {
    name: string;
    text: string;
    optional?: boolean;
    effects: AttributeEffect[];
}) => Ability;
export declare const whileCharacterIsAtLocationItGains: (params: {
    name: string;
    text: string;
    ability: StaticAbility | ActivatedAbility | TriggeredAbility;
}) => GainAbilityStaticAbility;
export declare function whileThisCharacterHasNoDamageGets({ name, text, effects, }: {
    name: string;
    text: string;
    effects: Effect[];
}): StaticAbilityWithEffect;
export declare function whileThisCharacterHasNoDamageGains({ name, text, ability, }: {
    name: string;
    text: string;
    ability: ActivatedAbility | StaticAbility | TriggeredAbility;
}): GainAbilityStaticAbility;
export declare function whileThisCharacterHasDamageGets({ name, text, effects, }: {
    name: string;
    text: string;
    effects: Effect[];
}): StaticAbilityWithEffect;
export declare function whileConditionThisCharacterGets({ name, text, effects, conditions, attribute, amount, }: {
    name: string;
    text: string;
    conditions: Condition[];
    effects: Effect[];
    attribute?: never;
    amount?: never;
} | {
    name: string;
    text: string;
    conditions: Condition[];
    attribute: "strength" | "willpower" | "lore";
    amount: number;
    effects?: never;
}): StaticAbilityWithEffect;
export declare function whileConditionThisCharacterGains({ name, text, ability, conditions, }: {
    name: string;
    text: string;
    conditions: Condition[];
    ability: GainAbilityStaticAbility["gainedAbility"] | StaticAbilityWithEffect;
}): GainAbilityStaticAbility;
export declare function whileNoOtherCharacterHasQuestedThisCharacterGets({ name, text, attribute, amount, }: {
    name: string;
    text: string;
    attribute?: "strength" | "willpower" | "lore";
    amount?: number;
}): StaticAbilityWithEffect;
export declare function whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets({ name, text, attribute, amount, }: {
    name: string;
    text: string;
    attribute: "strength" | "willpower" | "lore";
    amount: number;
}): StaticAbilityWithEffect;
export declare function whileYouHaveAnotherCharacterInPlayThisCharacterGets({ name, text, attribute, amount, }: {
    name: string;
    text: string;
    attribute?: "strength" | "willpower" | "lore";
    amount?: number;
}): StaticAbilityWithEffect;
export declare function whileYouHaveAnotherCharacterWithCharacteristicThisCharacterGets({ name, text, attribute, amount, characteristics, minAmount, }: {
    name: string;
    text: string;
    attribute?: "strength" | "willpower" | "lore";
    amount?: number;
    characteristics?: LorcanitoCard["characteristics"];
    minAmount?: number;
}): StaticAbilityWithEffect;
export declare function whileConditionOnThisCharacterTargetsGain({ name, text, ability, target, conditions, }: {
    name: string;
    text: string;
    conditions: Condition[];
    ability: GainAbilityStaticAbility["gainedAbility"] | StaticAbilityWithEffect;
    target: GainAbilityStaticAbility["target"];
}): GainAbilityStaticAbility;
export declare function targetCardsGains({ name, text, ability, target, conditions, }: {
    name: string;
    text: string;
    conditions?: Condition[];
    ability: GainAbilityStaticAbility["gainedAbility"] | StaticAbilityWithEffect;
    target: GainAbilityStaticAbility["target"];
}): GainAbilityStaticAbility;
export declare function whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains({ name, text, ability, characteristics, }: {
    name: string;
    text: string;
    ability: GainAbilityStaticAbility["gainedAbility"];
    characteristics?: LorcanitoCard["characteristics"];
}): GainAbilityStaticAbility;
export declare function whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars({ name, text, }: {
    name: string;
    text: string;
}): StaticAbility;
export declare function whileYouHaveNOrMoreCharactersWithNameInPlayThisCharacterGets({ name, text, characterName, amount, attribute, attributeAmount, }: {
    name: string;
    text: string;
    characterName: string;
    amount?: number;
    attribute?: "strength" | "willpower" | "lore";
    attributeAmount?: number;
}): StaticAbilityWithEffect;
export declare function whileYouHaveACharacterNamedThisCharGains({ name, text, characterName, ability, conditions, }: {
    name: string;
    text: string;
    characterName: string;
    conditions?: Condition[];
    ability: StaticAbility | ActivatedAbility | TriggeredAbility;
}): GainAbilityStaticAbility;
export declare function whileYouHaveACharacterNamedThisCharGets({ name, text, characterName, effects, conditions, }: {
    name: string;
    text: string;
    characterName: string;
    conditions?: Condition[];
    effects: Effect[];
}): StaticAbilityWithEffect;
export declare function whileYouHaveCharactersHere({ ability, name, text, conditions, }: {
    name?: string;
    text?: string;
    conditions?: Condition[];
    ability: StaticAbility | ActivatedAbility | TriggeredAbility;
}): GainAbilityStaticAbility;
export declare function whileYouHaveNoCaptainsInPlay({ name, text, ability, conditions, }: {
    name: string;
    text: string;
    conditions?: Condition[];
    ability: StaticAbility | ActivatedAbility | TriggeredAbility;
}): GainAbilityStaticAbility;
export declare const thisMissionIsCursed: RestrictionStaticAbility;
//# sourceMappingURL=whileAbilities.d.ts.map