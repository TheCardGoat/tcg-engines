import type {
  Condition,
  FilterCondition,
  ThisTurnCondition,
} from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import type { NumericComparison } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";

export function ifYouHaveCharacterNamed(
  name: string | string[],
): FilterCondition {
  return {
    type: "filter",
    comparison: {
      operator: "gte",
      value: 1,
    },
    filters: [
      {
        filter: "attribute",
        value: "name",
        comparison: {
          operator: "eq",
          value: typeof name === "string" ? name : name,
        },
      },
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      { filter: "owner", value: "self" },
    ],
  };
}

export function notHaveCharacterNamed(name: string | string[]): Condition {
  const condition = ifYouHaveCharacterNamed(name);
  const comparison: NumericComparison = {
    operator: "eq",
    value: 0,
  };

  return {
    ...condition,
    comparison,
  };
}

export function haveXorMoreCharactersInPlay(
  numCharactersMin: number,
): Condition {
  return {
    type: "filter",
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "play" },
      {
        filter: "type",
        value: "character",
      },
    ],
    comparison: { operator: "gte", value: numCharactersMin },
  };
}

export function ifYouHaveACardInYourDiscardNamed(
  name: string | string[],
): Condition {
  return {
    type: "filter",
    comparison: {
      operator: "gte",
      value: 1,
    },
    filters: [
      {
        filter: "attribute",
        value: "name",
        comparison: {
          operator: "eq",
          value: typeof name === "string" ? name : name,
        },
      },
      { filter: "zone", value: "discard" },
      { filter: "owner", value: "self" },
    ],
  };
}

export const whileYouHaveCharacterNamed = ifYouHaveCharacterNamed;

export const ifYouHaveAnotherPirate: Condition = {
  type: "filter",
  comparison: {
    operator: "gte",
    value: 2,
  },
  filters: [
    {
      filter: "characteristics",
      value: ["pirate"],
    },
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export const haveMoreItemsThanOpponent: Condition = {
  type: "clash",
  filters: [
    {
      filter: "type",
      value: "item",
    },
    {
      filter: "zone",
      value: "play",
    },
  ],
  operator: "gt",
};

export const haveMoreCardsThanOpponent: Condition = {
  type: "hand",
  amount: "gt",
  player: "self",
};

export const ifYouHaveAnInventor: Condition = {
  type: "filter",
  comparison: {
    operator: "gte",
    value: 1,
  },
  filters: [
    {
      filter: "characteristics",
      value: ["inventor"],
    },
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
  ],
};

export const haveItemInPlay: Condition = {
  type: "filter",
  filters: [
    { filter: "owner", value: "self" },
    {
      filter: "type",
      value: "item",
    },
    {
      filter: "zone",
      value: "play",
    },
  ],
  comparison: { operator: "gte", value: 1 },
};

export const have3orMorePuppiesInPlay: Condition = {
  type: "filter",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "play" },
    {
      filter: "type",
      value: "character",
    },
    {
      filter: "characteristics",
      value: ["puppy"],
    },
  ],
  comparison: { operator: "gte", value: 3 },
};

export const haveItemInDiscard: Condition = {
  type: "filter",
  filters: [
    { filter: "owner", value: "self" },
    {
      filter: "type",
      value: "item",
    },
    {
      filter: "zone",
      value: "discard",
    },
  ],
  comparison: { operator: "gte", value: 1 },
};

export const whileADamagedCharacterIsInPlay: Condition = {
  type: "filter",
  filters: [
    {
      filter: "type",
      value: "character",
    },
    {
      filter: "zone",
      value: "play",
    },
    {
      filter: "status",
      value: "damaged",
    },
  ],
  comparison: { operator: "gte", value: 1 },
};

export const whileAnotherDamagedCharacterIsInPlay: Condition = {
  type: "filter",
  filters: [
    {
      filter: "type",
      value: "character",
    },
    {
      filter: "zone",
      value: "play",
    },
    {
      filter: "status",
      value: "damaged",
    },
    {
      filter: "source",
      value: "other",
    },
  ],
  comparison: { operator: "gte", value: 1 },
};

export const whileYouHaveTwoOrMoreCharactersExerted: Condition = {
  type: "filter",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "character" },
    { filter: "status", value: "exerted" },
    { filter: "zone", value: "play" },
  ],
  comparison: { operator: "gte", value: 2 },
};

export const youHaveDamagedCharacter: Condition = {
  type: "filter",
  filters: [
    { filter: "owner", value: "self" },
    {
      filter: "type",
      value: "character",
    },
    {
      filter: "zone",
      value: "play",
    },
    {
      filter: "status",
      value: "damage",
      comparison: { operator: "gte", value: 1 },
    },
  ],
  comparison: { operator: "gte", value: 1 },
};

export function whileThereAreXOrMoreDamagedCharacter(
  numCharacters: number,
): Condition {
  return {
    type: "filter",
    filters: [
      {
        filter: "type",
        value: "character",
      },
      {
        filter: "zone",
        value: "play",
      },
      {
        filter: "status",
        value: "damage",
        comparison: { operator: "gte", value: 1 },
      },
    ],
    comparison: { operator: "gte", value: numCharacters },
  };
}

export const haveCaptainInPlay: Condition = {
  type: "filter",
  filters: [
    { filter: "owner", value: "self" },
    {
      filter: "type",
      value: "character",
    },
    {
      filter: "zone",
      value: "play",
    },
    {
      filter: "characteristics",
      value: ["captain"],
    },
  ],
  comparison: { operator: "gte", value: 1 },
};

export const dontHaveCaptainInPlay: Condition = {
  type: "filter",
  filters: [
    { filter: "owner", value: "self" },
    {
      filter: "type",
      value: "character",
    },
    {
      filter: "zone",
      value: "play",
    },
    {
      filter: "characteristics",
      value: ["captain"],
    },
  ],
  comparison: { operator: "lte", value: 0 },
};

export const haveElsaInPlay: Condition = {
  type: "filter",
  comparison: { operator: "gte", value: 1 },
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    {
      filter: "attribute",
      value: "name",
      comparison: { operator: "eq", value: "Elsa" },
    },
  ],
};

export const duringYourTurn: Condition = {
  type: "during-turn",
  value: "self",
};

export const duringOpponentsTurn: Condition = {
  type: "during-turn",
  value: "opponent",
};

export const ifYouHaveACharacterHere: Condition = {
  type: "chars-at-location",
  comparison: { operator: "gte", value: 1 },
};

export const ifThisCharacterIsExerted: Condition = { type: "exerted" };
export const whileThisCharacterIsExerted: Condition = { type: "exerted" };
export const ifThisCharacterIsAtALocation: Condition = {
  type: "char-is-at-location",
};
export const whileCharacterIsAtLocation: Condition =
  ifThisCharacterIsAtALocation;
export const unlessItIsAtALocation: Condition = {
  ...ifThisCharacterIsAtALocation,
  negate: true,
};

export const youDidntPutAnyCardsIntoYourInkwellThisTurn: ThisTurnCondition = {
  type: "this-turn",
  value: "inked",
  target: "self",
  negate: true,
};

export const haveNoCardsInYourHand: Condition = {
  type: "hand",
  player: "self",
  amount: 0,
};

export const haveCardsInYourHand: Condition = {
  ...haveNoCardsInYourHand,
  negate: true,
};
