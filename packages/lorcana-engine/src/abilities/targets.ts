import type {
  Abilities,
  CardEffectTarget,
  PlayerEffectTarget,
  TargetFilter,
} from "@lorcanito/lorcana-engine";
import type { Characteristics } from "../cards/cardTypes";

export const self: PlayerEffectTarget = {
  type: "player",
  value: "self",
};

export const chosenPlayer: PlayerEffectTarget = {
  type: "player",
  value: "target",
};

export const opponent: PlayerEffectTarget = {
  type: "player",
  value: "opponent",
};

export const chosenExertedCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "status", value: "exerted" },
  ],
};

export const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const targetTriggerCard: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "trigger", value: "target" }],
};

export const chosenCharacterCharacteristic = (
  characteristics: Characteristics[],
): CardEffectTarget => ({
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "characteristics", value: characteristics },
  ],
});

export const chosenCharacterNamed = (name: string): CardEffectTarget => {
  return {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: name },
      },
    ],
  };
};

export const chosenHeroCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    {
      filter: "characteristics",
      value: ["hero"],
    },
  ],
};

export const chosenPirateCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    {
      filter: "characteristics",
      value: ["pirate"],
    },
  ],
};

export const chosenCharacterOfYoursAtLocation: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    { filter: "status", value: "at-location" },
  ],
};

export const anotherChosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  excludeSelf: true,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const anyNumberOfChosenCharacters: CardEffectTarget = {
  type: "card",
  value: 99,
  upTo: true,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const chosenItem: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: ["item"] },
    { filter: "zone", value: "play" },
  ],
};

export const chosenItemOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: ["item"] },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export const chosenItemOrLocation: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: ["item", "location"] },
    { filter: "zone", value: "play" },
  ],
};

export const thisCharacter: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "source", value: "self" }],
};

export const sourceTarget: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "source", value: "target" }],
};

export const anyCard: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: ["character", "item", "location", "action"] },
  ],
};

export const targetCard: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "source", value: "target" }],
};

export const thisLocation = thisCharacter;

export const chosenLocation: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: ["location"] },
    { filter: "zone", value: "play" },
  ],
};

export const yourOtherCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const yourFloodbornCharsThatHaveACardUnder: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "character" },
    { filter: "characteristics", value: ["floodborn"] },
    { filter: "zone", value: "play" },
    { filter: "status", value: "has-card-under" },
  ],
};

export const yourLocations: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "location" },
    { filter: "zone", value: "play" },
  ],
};

export const yourBanishedLocations: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "location" },
    { filter: "zone", value: ["discard", "play"] },
  ],
};

export const yourItems: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "item" },
    { filter: "zone", value: "play" },
  ],
};

export const yourBanishedItems: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "item" },
    { filter: "zone", value: ["discard", "play"] },
  ],
};

export const chosenCharacterOrLocation: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: ["character", "location"] },
    { filter: "zone", value: "play" },
  ],
};

export const chosenYourDamagedCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    {
      filter: "status",
      value: "damage",
      comparison: { operator: "gte", value: 1 },
    },
  ],
};

export const chosenDamagedCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    {
      filter: "status",
      value: "damage",
      comparison: { operator: "gte", value: 1 },
    },
  ],
};

export const anotherChosenCharacterOfYours: CardEffectTarget = {
  excludeSelf: true,
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};
export const chosenCharacterOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export const anyNumberOfYourCharacters: CardEffectTarget = {
  type: "card",
  value: 99,
  upTo: true,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export const chosenLocationOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "location" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export const chosenCharacterOfYoursIncludingSelf: CardEffectTarget = {
  type: "card",
  value: 1,
  includeSelf: true,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export const chosenOtherCharacterOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  excludeSelf: true,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    { filter: "source", value: "other" },
  ],
};

export const chosenOpposingCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
  ],
};

export const thisCard: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "source", value: "self" }],
};

export const eachOpposingReadyCharacter: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
    { filter: "status", value: "ready" },
  ],
};

export const eachOpposingDamagedCharacter: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
    {
      filter: "status",
      value: "damage",
      comparison: { operator: "gte", value: 1 },
    },
  ],
};

export const allOpposingItems: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "item" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
  ],
};

export const allOpposingLocations: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "location" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
  ],
};

export const allOpposingCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
  ],
};

export const eachOpposingCharacter = allOpposingCharacters;

export const opposingCharacters = allOpposingCharacters;

export const allYourCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export function yourCharactersNamed(name: string): CardEffectTarget {
  return {
    type: "card",
    value: "all",
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      { filter: "owner", value: "self" },
      {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: name },
      },
    ],
  };
}

export const allCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const eachCharacterInPlay = allCharacters;

export const eachOtherCharacterInPlay: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const yourLocationCards: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "location" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export const allYourCharacteristicCharacters = (
  characteristics: Characteristics[],
  excludeSelf = false,
): CardEffectTarget => ({
  type: "card",
  value: "all",
  excludeSelf,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    { filter: "characteristics", value: characteristics },
  ],
});

export const eachOfYourCharacters = allYourCharacters;

export const oneOfYourCharacters = allYourCharacters;

export const oneOfYourOtherCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "character" },
  ],
};

export const oneOfYourOpponentsCharactersItemsOrLocations: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "owner", value: "opponent" },
    { filter: "type", value: ["character", "item", "location"] },
  ],
};

export const yourCharacters = allYourCharacters;
export const chosenCardFromYourHand: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "hand" },
    { filter: "owner", value: "self" },
  ],
};
export const allCardsFromYourHand: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "zone", value: "hand" },
    { filter: "owner", value: "self" },
  ],
};
export const topCardOfYourDeck: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [{ filter: "top-deck", value: "self" }],
};

export const topCardOfOpponentDeck: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [{ filter: "top-deck", value: "opponent" }],
};

export const topCardOfOpponentsDeck: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [{ filter: "top-deck", value: "opponent" }],
};

export const topXCardsOfYourDeck = (value: number): CardEffectTarget => ({
  type: "card",
  value,
  filters: [{ filter: "top-deck", value: "self" }],
}); // TODO: This should work

export const topXCardsOfOpponentsDeck = (value: number): CardEffectTarget => ({
  type: "card",
  value,
  filters: [{ filter: "top-deck", value: "opponent" }],
}); // TODO: This should work

export function withCostXorLess(cost: number): TargetFilter {
  return {
    filter: "attribute",
    value: "cost",
    comparison: { operator: "lte", value: cost },
  };
}

export function chosenCharacterWithCostXorLess(cost: number): CardEffectTarget {
  return {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      withCostXorLess(cost),
    ],
  };
}

export function withStrengthXorLess(cost: number): TargetFilter {
  return {
    filter: "attribute",
    value: "strength",
    comparison: { operator: "lte", value: cost },
  };
}

export function withStrengthXorMore(cost: number): TargetFilter {
  return {
    filter: "attribute",
    value: "strength",
    comparison: { operator: "gte", value: cost },
  };
}

export function chosenCharacterWithStrengthXorLess(
  str: number,
): CardEffectTarget {
  return {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      withStrengthXorLess(str),
    ],
  };
}

export const whileHereTarget: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    {
      filter: "location",
      value: "source",
    },
    { filter: "type", value: "character" },
  ],
};

export const challengingCharacter: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "challenge", value: "attacker" }],
};

export const anyCardTargetYouOwn: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "owner", value: "self" }],
};

export const anyTarget: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: ["character", "item", "location", "action"] },
  ],
};

export const namedCard: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    // { filter: "zone", value: "deck" },
    // { filter: "owner", value: "self" },
    {
      filter: "name-a-card",
    },
  ],
};

/* This will play the card with the instanceId that matches the parent's target.
   Example: jafarHighSultanOfLorcana
*/
export const parentsTarget: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    {
      filter: "attribute",
      value: "instanceId",
      comparison: { operator: "eq", value: "target" },
    },
  ],
};

export const allYourCharactersWithAnSpecificAbility = (
  ability: Abilities,
  excludeSelf = false,
): CardEffectTarget => ({
  type: "card",
  value: "all",
  excludeSelf,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    { filter: "ability", value: ability },
  ],
});
