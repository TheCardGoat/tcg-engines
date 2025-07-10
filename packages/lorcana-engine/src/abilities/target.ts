import type { CardEffectTarget, TargetFilter } from "@lorcanito/lorcana-engine";

export const anyCardYouOwn: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "owner", value: "self" }],
};
export const oneCardFromHand: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "hand" },
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
export const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
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
export const chosenOpposingDamagedCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
    { filter: "status", value: "damaged" },
  ],
};
export function opposingCharactersWithCostXorLess(_cost = 1): CardEffectTarget {
  return {
    type: "card",
    value: _cost,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      { filter: "owner", value: "opponent" },
    ],
  };
}
export const chosenCharacterItemOrLocation: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    {
      filter: "type",
      value: ["character", "location", "item"],
    },
    { filter: "zone", value: "play" },
  ],
};
export const anotherChosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  excludeSelf: true,
  filters: chosenCharacter.filters,
};

export const itemsYouControl: TargetFilter[] = [
  { filter: "type", value: "item" },
  { filter: "zone", value: "play" },
  { filter: "owner", value: "self" },
];

export const readyItemsYouControl: TargetFilter[] = [
  { filter: "type", value: "item" },
  { filter: "zone", value: "play" },
  { filter: "owner", value: "self" },
  { filter: "status", value: "ready" },
];

export const anotherChosenCharOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  excludeSelf: true,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    { filter: "type", value: "character" },
  ],
};
export const chosenItem: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "item" },
  ],
};
export const chosenItemOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "item" },
    { filter: "owner", value: "self" },
  ],
};
export const chosenItemOfYoursInHand: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "hand" },
    { filter: "type", value: "item" },
    { filter: "owner", value: "self" },
  ],
};
export const allOtherCharactersHere: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    { filter: "status", value: "at-location" },
  ],
};
export const yourOtherCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
  ],
};
export const yourDamagedCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    { filter: "status", value: "damaged" },
  ],
};
export const yourOtherLocations: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "location" },
    { filter: "owner", value: "self" },
  ],
};
export const otherCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  excludeSelf: true,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const opposingCharacters: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
    { filter: "type", value: "character" },
  ],
};

export const opposingCharactersWithEvasive: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
    { filter: "type", value: "character" },
    { filter: "ability", value: "evasive" },
  ],
};

export const opposingCharactersWithoutEvasive: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
    { filter: "type", value: "character" },
    { filter: "ability", value: "evasive" },
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

export const chosenCharacterOrLocation: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: ["location", "character"] },
    { filter: "zone", value: "play" },
  ],
};

export const actionCardsInHand: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "action" },
    { filter: "zone", value: "hand" },
  ],
};
