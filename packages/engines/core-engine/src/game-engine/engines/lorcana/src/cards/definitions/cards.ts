// import { allCards, allCardsById } from "@lorcanito/lorcana-engine";

import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { allTFCCards, allTFCCardsById } from "./001";
import { allROFCards, allROFCardsById } from "./002";
import { allITICards, allITICardsById } from "./003";
import { allURRCards, allURRCardsById } from "./004";
import { allSSKCards, allSSKCardsById } from "./005";
import { all006Cards, all006CardsById } from "./006";
import { all007Cards, all007CardsById } from "./007";
import { all008Cards, all008CardsById } from "./008";

export const allCards: LorcanaCardDefinition[] = [
  ...allTFCCards,
  ...allROFCards,
  ...allITICards,
  ...allURRCards,
  ...allSSKCards,
  ...all006Cards,
  ...all007Cards,
  ...all008Cards,
];

export const allCardsById: Record<string, LorcanaCardDefinition> = {
  ...allTFCCardsById,
  ...allROFCardsById,
  ...allITICardsById,
  ...allURRCardsById,
  ...allSSKCardsById,
  ...all006CardsById,
  ...all007CardsById,
  ...all008CardsById,
};
