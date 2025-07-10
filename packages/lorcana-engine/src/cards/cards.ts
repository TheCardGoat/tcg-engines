import {
  allTFCCards,
  allTFCCardsById,
} from "@lorcanito/lorcana-engine/cards/001";
import {
  allROFCards,
  allROFCardsById,
} from "@lorcanito/lorcana-engine/cards/002";
import {
  allITICards,
  allITICardsById,
} from "@lorcanito/lorcana-engine/cards/003";
import {
  allURRCards,
  allURRCardsById,
} from "@lorcanito/lorcana-engine/cards/004";
import {
  allSSKCards,
  allSSKCardsById,
} from "@lorcanito/lorcana-engine/cards/005";
import {
  all006Cards,
  all006CardsById,
} from "@lorcanito/lorcana-engine/cards/006";
import {
  all007Cards,
  all007CardsById,
} from "@lorcanito/lorcana-engine/cards/007";
import {
  all008Cards,
  all008CardsById,
} from "@lorcanito/lorcana-engine/cards/008";
import type { LorcanitoCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const allCards: LorcanitoCard[] = [
  ...allTFCCards,
  ...allROFCards,
  ...allITICards,
  ...allURRCards,
  ...allSSKCards,
  ...all006Cards,
  ...all007Cards,
  ...all008Cards,
];

export const allCardsById: Record<string, LorcanitoCard> = {
  ...allTFCCardsById,
  ...allROFCardsById,
  ...allITICardsById,
  ...allURRCardsById,
  ...allSSKCardsById,
  ...all006CardsById,
  ...all007CardsById,
  ...all008CardsById,
};
