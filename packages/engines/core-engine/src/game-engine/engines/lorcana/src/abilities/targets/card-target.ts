import type {
  DynamicValue,
  Keyword,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { BaseTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

export interface CardTarget extends BaseTarget {
  type: "card";
  zone?: LorcanaZone; // Zone can be specified for card targets
  controller?: "self" | "opponent" | "any" | "target"; // Can target cards controlled by self, opponent, or any player
  damaged?: boolean; // For "chosen damaged character"
  ready?: boolean; // For "chosen ready character"
  exerted?: boolean; // For "chosen exerted character"
  withKeyword?: Keyword; // For "chosen character with [keyword]"
  withClassification?: string; // For "chosen [classification] character"
  withName?: string; // For "chosen character named X"
  minStrength?: number; // For "chosen character with 3 {S} or more"
  maxStrength?: number; // For "chosen character with 2 {S} or less"
  excludeSelf?: boolean; // For "chosen another character"
  filter?: LorcanaCardFilter;
  count?: number | DynamicValue;
}

export const allCharactersTarget: CardTarget = {
  type: "card",
  zone: "play",
  targetAll: true,
};

export const allOpposingCharactersTarget: CardTarget = {
  ...allCharactersTarget,
  controller: "opponent",
};
