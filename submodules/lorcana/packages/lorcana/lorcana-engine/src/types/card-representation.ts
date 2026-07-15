import type { CardInstanceId, RuntimeCardWithDefinition } from "#core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";

export type LorcanaStaticCard = LorcanaCardDefinition;

export type LorcanaRuntimeCard = RuntimeCardWithDefinition;

export type LorcanaDynamicCard = LorcanaRuntimeCard;
export type CardInput = CardInstanceId | LorcanaRuntimeCard | LorcanaStaticCard | string;

export function cardRef(card: CardInput): CardInput {
  return card;
}
