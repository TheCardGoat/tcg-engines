import type {
  ComparisonOperator,
  DynamicValue,
  Keyword,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { BaseTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

export interface CardTarget extends BaseTarget {
  type: "card";
  cardType: LorcanaCardDefinition["type"];
  zone?: LorcanaZone; // Zone can be specified for card targets
  owner?: "self" | "opponent" | "any" | "target";
  damaged?: boolean; // For "chosen damaged character"
  ready?: boolean; // For "chosen ready character"
  exerted?: boolean; // For "chosen exerted character"
  withKeyword?: Keyword; // For "chosen character with [keyword]"
  withClassification?: string; // For "chosen [classification] character"
  withName?: string; // For "chosen character named X"
  excludeSelf?: boolean; // For "chosen another character"
  has?: "challenged";
  filter?: LorcanaCardFilter;
  min?: number;
  max?: number;
  count?: number | DynamicValue;
}

export const allCharactersTarget: CardTarget = {
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

export function chosenCharacterWithTarget({
  attribute = "strength",
  amount,
  comparison,
}: {
  attribute?: "strength";
  comparison: ComparisonOperator;
  amount: number;
}): CardTarget {
  const filter: LorcanaCardFilter = {};

  if (attribute === "strength") {
    filter.strength =
      comparison === "gte"
        ? { min: amount }
        : comparison === "lte"
          ? { max: amount }
          : { exact: amount };
  }

  return {
    type: "card",
    cardType: "character",
    filter,
  };
}
