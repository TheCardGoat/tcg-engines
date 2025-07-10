import type {
  Ability,
  AttributeEffect,
  CardRestrictionEffect,
  Effect,
  GainAbilityStaticAbility,
  LorcanitoCard,
  StaticAbility,
  TriggeredAbility,
} from "@lorcanito/lorcana-engine";
import type {
  ActivatedAbility,
  RestrictionStaticAbility,
  StaticAbilityWithEffect,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { haveMoreItemsThanOpponent } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import {
  thisCard,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";

// Sample text
// While this character is at a location, it gets +2 {S}.
// While this character is at a location, she gets +2 {S}.
// When this character is at a location, she gets +3 {S}.
// While this character is at a location, he gets +1 {L}.
// While this character is at a location, he gets +2 {S}.
export const whileCharacterIsAtLocationItGets = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: AttributeEffect[];
}): Ability => {
  const { name, text, effects } = params;

  return whileConditionThisCharacterGets({
    name,
    text,
    effects,
    conditions: [
      {
        type: "char-is-at-location",
      },
    ],
  });
};

export const whileCharacterIsAtLocationItGains = (params: {
  name: string;
  text: string;
  ability: StaticAbility | ActivatedAbility | TriggeredAbility;
}): GainAbilityStaticAbility => {
  const { name, text, ability } = params;

  return {
    type: "static",
    name,
    text,
    conditions: [
      {
        type: "char-is-at-location",
      },
    ],
    ability: "gain-ability",
    target: thisCard,
    gainedAbility: ability,
  };
};

export function whileThisCharacterHasNoDamageGets({
  name,
  text,
  effects,
}: {
  name: string;
  text: string;
  effects: Effect[];
}): StaticAbilityWithEffect {
  return {
    type: "static",
    ability: "effects",
    effects,
    name,
    text,
    conditions: [
      {
        type: "damage",
        comparison: { operator: "eq", value: 0 },
      },
    ],
  };
}

export function whileThisCharacterHasNoDamageGains({
  name,
  text,
  ability,
}: {
  name: string;
  text: string;
  ability: ActivatedAbility | StaticAbility | TriggeredAbility;
}): GainAbilityStaticAbility {
  return {
    type: "static",
    ability: "gain-ability",
    target: thisCharacter,
    gainedAbility: ability,
    name,
    text,
    conditions: [
      {
        type: "damage",
        comparison: { operator: "eq", value: 0 },
      },
    ],
  };
}

// Sample text
// While this character is damaged, he gets +2 {S}.
export function whileThisCharacterHasDamageGets({
  name,
  text,
  effects,
}: {
  name: string;
  text: string;
  effects: Effect[];
}): StaticAbilityWithEffect {
  return {
    type: "static",
    ability: "effects",
    effects,
    name,
    text,
    conditions: [
      {
        type: "damage",
        comparison: { operator: "gt", value: 0 },
      },
    ],
  };
}

// Sample text
// While you have more cards in hand than each opponent, this character gets +2 {L}.
// While you have an item card in your discard, this character gets +2 {S}.
// While an opponent has 10 or more lore, this character gets +6 {S}.
// While you have a Captain character in play, this character gets +1 {L}.
// While you have 10 or more cards in your inkwell, this character gets +4 {L}.
// While you have a Captain character in play, this character gets +2 {L}.
// While you have another character with Support in play, this character gets +2 {S}.
// While you have a damaged character here, this location gets +2 {L}
export function whileConditionThisCharacterGets({
  name,
  text,
  effects,
  conditions,
  attribute,
  amount,
}:
  | {
      name: string;
      text: string;
      conditions: Condition[];
      effects: Effect[];
      attribute?: never;
      amount?: never;
    }
  | {
      name: string;
      text: string;
      conditions: Condition[];
      attribute: "strength" | "willpower" | "lore";
      amount: number;
      effects?: never;
    }): StaticAbilityWithEffect {
  if (attribute && amount) {
    return {
      type: "static",
      ability: "effects",
      name,
      text,
      conditions,
      effects: [
        {
          type: "attribute",
          attribute,
          amount,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    };
  }

  if (effects) {
    return {
      type: "static",
      ability: "effects",
      effects,
      name,
      text,
      conditions,
    };
  }

  console.error("==> Invalid whileConditionThisCharacterGets.");

  return {
    type: "static",
    ability: "effects",
    effects: [],
    name,
    text,
    conditions,
  };
}

// Sample text
// While you have another character in play, this character gains **Evasive**.
// While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters
// During your turn, this character gains **Evasive**
export function whileConditionThisCharacterGains({
  name,
  text,
  ability,
  conditions,
}: {
  name: string;
  text: string;
  conditions: Condition[];
  ability: GainAbilityStaticAbility["gainedAbility"] | StaticAbilityWithEffect;
}): GainAbilityStaticAbility {
  return whileConditionOnThisCharacterTargetsGain({
    name,
    text,
    conditions,
    target: thisCharacter,
    ability,
  });
}

// Sample text
// During your turn, if no other character has quested this turn, this character gets +3 {L}.
export function whileNoOtherCharacterHasQuestedThisCharacterGets({
  name,
  text,
  attribute = "lore",
  amount = 3,
}: {
  name: string;
  text: string;
  attribute?: "strength" | "willpower" | "lore";
  amount?: number;
}): StaticAbilityWithEffect {
  return {
    type: "static",
    ability: "effects",
    name,
    text,
    effects: [
      {
        type: "attribute",
        attribute,
        amount,
        modifier: "add",
        target: thisCharacter,
      },
    ],
    conditions: [
      {
        type: "no-other-character-has-quested",
      },
      {
        type: "during-turn",
        value: "self",
      },
    ],
  };
}

// Sample text
// While you have more items in play than each opponent, this character gets +2 {L}.
export function whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets({
  name,
  text,
  attribute,
  amount,
}: {
  name: string;
  text: string;
  attribute: "strength" | "willpower" | "lore";
  amount: number;
}): StaticAbilityWithEffect {
  return {
    type: "static",
    ability: "effects",
    name,
    text,
    effects: [
      {
        type: "attribute",
        attribute,
        amount,
        modifier: "add",
        target: thisCharacter,
      },
    ],
    conditions: [haveMoreItemsThanOpponent],
  };
}

// Sample text
// While you have another character in play, this character gets +2 {S}.
export function whileYouHaveAnotherCharacterInPlayThisCharacterGets({
  name,
  text,
  attribute = "strength",
  amount = 2,
}: {
  name: string;
  text: string;
  attribute?: "strength" | "willpower" | "lore";
  amount?: number;
}): StaticAbilityWithEffect {
  return {
    type: "static",
    ability: "effects",
    name,
    text,
    effects: [
      {
        type: "attribute",
        attribute,
        amount,
        modifier: "add",
        target: thisCharacter,
      },
    ],
    conditions: [
      {
        type: "not-alone",
      },
    ],
  };
}

// Sample text
// If you have another Hero character in play, this character gets +1 {L}.
export function whileYouHaveAnotherCharacterWithCharacteristicThisCharacterGets({
  name,
  text,
  attribute = "lore",
  amount = 1,
  characteristics = ["hero"],
  minAmount = 2,
}: {
  name: string;
  text: string;
  attribute?: "strength" | "willpower" | "lore";
  amount?: number;
  characteristics?: LorcanitoCard["characteristics"];
  minAmount?: number;
}): StaticAbilityWithEffect {
  return {
    type: "static",
    ability: "effects",
    name,
    text,
    effects: [
      {
        type: "attribute",
        attribute,
        amount,
        modifier: "add",
        target: thisCharacter,
      },
    ],
    conditions: [
      {
        type: "filter",
        comparison: {
          operator: "gte",
          value: minAmount,
        },
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "characteristics", value: characteristics },
        ],
      },
    ],
  };
}

// Sample text
// While this character is exerted, your Ally characters gain +1 {S}.
// While this character is exerted, opposing character can't quest
// While this character is exerted, opposing characters with **Evasive** gain **Reckless**
export function whileConditionOnThisCharacterTargetsGain({
  name,
  text,
  ability,
  target,
  conditions,
}: {
  name: string;
  text: string;
  conditions: Condition[];
  ability: GainAbilityStaticAbility["gainedAbility"] | StaticAbilityWithEffect;
  target: GainAbilityStaticAbility["target"];
}): GainAbilityStaticAbility {
  return targetCardsGains({
    ability,
    conditions,
    name,
    text,
    target,
  });
}

export function targetCardsGains({
  name,
  text,
  ability,
  target,
  conditions,
}: {
  name: string;
  text: string;
  conditions?: Condition[];
  ability: GainAbilityStaticAbility["gainedAbility"] | StaticAbilityWithEffect;
  target: GainAbilityStaticAbility["target"];
}): GainAbilityStaticAbility {
  return {
    type: "static",
    ability: "gain-ability",
    gainedAbility: ability,
    conditions,
    name,
    text,
    target,
  };
}

// Sample texts:
//  While you have another Pirate character in play, this character gains Challenger +3.
export function whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains({
  name,
  text,
  ability,
  characteristics = [],
}: {
  name: string;
  text: string;
  ability: GainAbilityStaticAbility["gainedAbility"];
  characteristics?: LorcanitoCard["characteristics"];
}): GainAbilityStaticAbility {
  return {
    type: "static",
    ability: "gain-ability",
    name: name,
    text: text,
    target: thisCard,
    gainedAbility: ability,
    conditions: [
      {
        type: "filter",
        filters: [
          {
            filter: "characteristics",
            value: characteristics,
          },
          { filter: "type", value: "character" },
          {
            filter: "owner",
            value: "self",
          },
          { filter: "zone", value: "play" },
        ],
        comparison: { operator: "gt", value: 1 }, //kakamora is also a pirate
      },
    ],
  };
}

// Sample text
// While you have no cards in your hand, this character can challenge ready characters.
export function whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars({
  name,
  text,
}: {
  name: string;
  text: string;
}): StaticAbility {
  return {
    type: "static",
    ability: "challenge-ready-chars",
    name,
    text,
    conditions: [{ type: "hand", amount: 0, player: "self" }],
  };
}

// Sample text
// While you have 2 or more Broom characters in play, this character gets +2 {L}.
export function whileYouHaveNOrMoreCharactersWithNameInPlayThisCharacterGets({
  name,
  text,
  characterName,
  amount = 2,
  attribute = "lore",
  attributeAmount = 2,
}: {
  name: string;
  text: string;
  characterName: string;
  amount?: number;
  attribute?: "strength" | "willpower" | "lore";
  attributeAmount?: number;
}): StaticAbilityWithEffect {
  return {
    type: "static",
    ability: "effects",
    name,
    text,
    effects: [
      {
        type: "attribute",
        attribute,
        amount: attributeAmount,
        modifier: "add",
        target: thisCharacter,
      },
    ],
    conditions: [
      {
        type: "filter",
        comparison: {
          operator: "gte",
          value: amount,
        },
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: characterName },
          },
        ],
      },
    ],
  };
}

// Sample text
// While you have a character named Snow White in play, this character gains **Bodyguard**.
// While you have a character named Dale in play, this character gains **Support**
// While you have a character named Gazelle in play, this character gains Singer 6.
// While you have a character named Hades in play, this character gains Challenger +2.
export function whileYouHaveACharacterNamedThisCharGains({
  name,
  text,
  characterName,
  ability,
  conditions = [],
}: {
  name: string;
  text: string;
  characterName: string;
  conditions?: Condition[];
  ability: StaticAbility | ActivatedAbility | TriggeredAbility;
}): GainAbilityStaticAbility {
  return {
    type: "static",
    ability: "gain-ability",
    target: thisCharacter,
    gainedAbility: ability,
    name,
    text,
    conditions: [
      ...conditions,
      {
        type: "filter",
        comparison: {
          operator: "gte",
          value: 1,
        },
        filters: [
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: characterName },
          },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      },
    ],
  };
}

export function whileYouHaveACharacterNamedThisCharGets({
  name,
  text,
  characterName,
  effects,
  conditions = [],
}: {
  name: string;
  text: string;
  characterName: string;
  conditions?: Condition[];
  effects: Effect[];
}): StaticAbilityWithEffect {
  return {
    type: "static",
    ability: "effects",
    name,
    text,
    effects,
    conditions: [
      ...conditions,
      {
        type: "filter",
        comparison: {
          operator: "gte",
          value: 1,
        },
        filters: [
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: characterName },
          },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      },
    ],
  };
}

export function whileYouHaveCharactersHere({
  ability,
  name,
  text,
  conditions = [],
}: {
  name?: string;
  text?: string;
  conditions?: Condition[];
  ability: StaticAbility | ActivatedAbility | TriggeredAbility;
}): GainAbilityStaticAbility {
  return {
    type: "static",
    ability: "gain-ability",
    target: thisCharacter,
    gainedAbility: ability,
    name,
    text,
    conditions: conditions,
  };
}

export function whileYouHaveNoCaptainsInPlay({
  name,
  text,
  ability,
  conditions = [],
}: {
  name: string;
  text: string;
  conditions?: Condition[];
  ability: StaticAbility | ActivatedAbility | TriggeredAbility;
}): GainAbilityStaticAbility {
  return {
    type: "static",
    ability: "gain-ability",
    target: thisCard,
    name,
    text,
    conditions: conditions,
    gainedAbility: ability,
  };
}

// Card's Abilities

const restrictionEffect: CardRestrictionEffect = {
  type: "restriction",
  restriction: "ready-at-start-of-turn",
  duration: "static",
  target: thisCharacter,
};

export const thisMissionIsCursed: RestrictionStaticAbility = {
  type: "static",
  ability: "restriction",
  target: thisCharacter,
  effect: restrictionEffect,
  name: "This Mission Is Cursed",
  text: "This character doesn’t ready at the start of the turn.",
};
