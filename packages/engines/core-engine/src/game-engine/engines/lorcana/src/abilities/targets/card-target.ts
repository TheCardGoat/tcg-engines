import type {
  ComparisonOperator,
  DynamicValue,
  Keyword,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { BaseTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

export interface CardTarget extends BaseTarget {
  type: "card";
  cardType?:
    | LorcanaCardDefinition["type"]
    | Array<LorcanaCardDefinition["type"]>;
  zone?: LorcanaZone; // Zone can be specified for card targets
  owner?: "self" | "opponent" | "any" | "target" | "source";
  damaged?: boolean; // For "chosen damaged character"
  ready?: boolean; // For "chosen ready character"
  exerted?: boolean; // For "chosen exerted character"
  withKeyword?: Keyword; // For "chosen character with [keyword]"
  withoutKeyword?: Keyword; // For "chosen character without [keyword]"
  withClassification?: string; // For "chosen [classification] character"
  withName?: string; // For "chosen character named X"
  withNamedCard?: boolean; // For targeting cards with the name from a previous nameCard effect
  excludeSelf?: boolean; // For "chosen another character"
  has?: "challenged";
  filter?: LorcanaCardFilter;
  min?: number;
  max?: number;
  count?: number | DynamicValue;
  random?: boolean; // For "random character"
}

export const allCharactersTarget: CardTarget = {
  type: "card",
  zone: "play",
  cardType: "character",
  targetAll: true,
};

export const yourCharactersTarget: CardTarget = {
  ...allCharactersTarget,
  owner: "self",
};

export const allBodyGuardCharactersTarget: CardTarget = {
  type: "card",
  zone: "play",
  cardType: "character",
  targetAll: true,
};

export const allItemsTarget: CardTarget = {
  type: "card",
  cardType: "item",
  zone: "play",
  owner: "self",
};

export const anyNumberOfYourItems: CardTarget = {
  type: "card",
  cardType: "item",
  zone: "play",
  min: 0,
  max: 1,
};

export const anyNumberOfChosenCharacters: CardTarget = {
  type: "card",
  cardType: "character",
  zone: "play",
  min: 0,
};

export const allOpposingCharactersTarget: CardTarget = {
  ...allCharactersTarget,
  owner: "opponent",
};

export const chosenCharacterTarget: CardTarget = {
  type: "card",
  zone: "play",
  cardType: "character",
  count: 1,
};

export const chosenCharacterWhoHasChallengedTarget: CardTarget = {
  ...chosenCharacterTarget,
  has: "challenged",
};

export const chosenCharacterOfYoursTarget: CardTarget = {
  ...chosenCharacterTarget,
  owner: "self",
};

export const chosenDamagedCharacterTarget: CardTarget = {
  ...chosenCharacterTarget,
  damaged: true,
};

export const chosenExertedCharacterTarget: CardTarget = {
  ...chosenCharacterTarget,
  exerted: true,
};

export const chosenItemTarget: CardTarget = {
  type: "card",
  zone: "play",
  cardType: "item",
  count: 1,
};

export const chosenItemFromDiscardTarget: CardTarget = {
  ...chosenItemTarget,
  zone: "discard",
};

export const chosenActionFromDiscardTarget: CardTarget = {
  type: "card",
  cardType: "action",
  zone: "discard",
  count: 1,
};

export const chosenCharacterFromDiscardTarget: CardTarget = {
  type: "card",
  cardType: "character",
  zone: "discard",
  count: 1,
};

export const chosenCharacterWithCost2OrLessFromDiscardTarget: CardTarget = {
  type: "card",
  cardType: "character",
  zone: "discard",
  filter: {
    cost: { max: 2 },
  },
  count: 1,
};

export const chosenCharacterOrItemWithCost2OrLessTarget: CardTarget = {
  type: "card",
  cardType: ["character", "item"],
  filter: {
    cost: { max: 2 },
  },
  count: 1,
};

export const chosenCharacterItemOrLocationWithCost2OrLessTarget: CardTarget = {
  type: "card",
  cardType: ["character", "item", "location"],
  filter: {
    cost: { max: 2 },
  },
  count: 1,
};

export const chosenCharacterOrLocationTarget: CardTarget = {
  type: "card",
  zone: "play",
  cardType: ["character", "location"],
  count: 1,
};

export const chosenItemOrLocationTarget: CardTarget = {
  type: "card",
  zone: "play",
  cardType: ["item", "location"],
  count: 1,
};

export const chosenLocationTarget: CardTarget = {
  type: "card",
  zone: "play",
  cardType: "location",
  count: 1,
};

export const chosenCardFromHandTarget: CardTarget = {
  type: "card",
  zone: "hand",
  count: 1,
};

export function upToTarget({
  target,
  upTo,
}: {
  target: CardTarget;
  upTo: number;
}): CardTarget {
  return {
    ...target,
    count: undefined,
    min: 0,
    max: upTo,
  };
}

export function chosenCharacterWithTarget({
  attribute = "strength",
  value,
  comparison,
}: {
  attribute?: "strength";
  comparison?: ComparisonOperator;
  value: number;
}): CardTarget {
  const filter: LorcanaCardFilter = {};

  if (attribute === "strength") {
    filter.strength =
      comparison === "gte"
        ? { min: value }
        : comparison === "lte"
          ? { max: value }
          : { exact: value };
  }

  return {
    type: "card",
    cardType: "character",
    filter,
  };
}

export function yourCharacterWithKeywordTarget(keyword: string): CardTarget {
  return {
    type: "card" as const,
    cardType: "character",
    owner: "self",
    withKeyword: keyword as Keyword,
    count: 1,
  };
}

// TODO: This target needs dynamic filtering support to compare against previous effect target's strength
export function chosenCharacterWithLessStrengthThanPreviousTarget(): CardTarget {
  return {
    type: "card" as const,
    cardType: "character",
    count: 1,
    // TODO: Need to implement dynamic comparison to previous target's strength
    // This should filter for characters with less strength than the previously banished character
  };
}

export function cardNamedTarget({ name }: { name: string }): CardTarget {
  return {
    type: "card",
    zone: "play",
    withName: name,
    count: 1,
  };
}

export const yourCharactersInPlayFilter: LorcanaCardFilter = {
  cardType: "character",
  owner: "self",
  zone: "play",
};

export const yourExertedCharactersFilter: LorcanaCardFilter = {
  cardType: "character",
  owner: "self",
  zone: "play",
  exerted: true,
};

export const opponentsDamagedCharactersFilter: LorcanaCardFilter = {
  cardType: "character",
  owner: "opponent",
  zone: "play",
  damaged: true,
};

export const yourDamagedCharactersFilter: LorcanaCardFilter = {
  cardType: "character",
  owner: "self",
  zone: "play",
  damaged: true,
};

// Target for "this card" - the source card that has the ability
export const sourceCardTarget: CardTarget = {
  type: "card",
  owner: "source",
  count: 1,
};
