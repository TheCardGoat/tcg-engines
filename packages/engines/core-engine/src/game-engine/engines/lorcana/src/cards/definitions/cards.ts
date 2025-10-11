// // Legacy import removed - types available via local definitions

import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { all001Cards, all001CardsById } from "./001/all-cards";
import { all002Cards, all002CardsById } from "./002/all-cards";
import { all003Cards, all003CardsById } from "./003/all-cards";
import { all004Cards, all004CardsById } from "./004/all-cards";
import { all005Cards, all005CardsById } from "./005/all-cards";
import { all006Cards, all006CardsById } from "./006/all-cards";
import { all007Cards, all007CardsById } from "./007/all-cards";
import { all008Cards, all008CardsById } from "./008/all-cards";
import { all009Cards, all009CardsById } from "./009/all-cards";

export const allCards: LorcanaCardDefinition[] = [
  ...all001Cards,
  ...all002Cards,
  ...all003Cards,
  ...all004Cards,
  ...all005Cards,
  ...all006Cards,
  ...all007Cards,
  ...all008Cards,
  ...all009Cards,
];

export const allCardsById: Record<string, LorcanaCardDefinition> = {
  ...all001CardsById,
  ...all002CardsById,
  ...all003CardsById,
  ...all004CardsById,
  ...all005CardsById,
  ...all006CardsById,
  ...all007CardsById,
  ...all008CardsById,
  ...all009CardsById,
};
