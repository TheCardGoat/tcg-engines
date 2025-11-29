import { all001Cards, all001CardsById } from "./001";
import { all002Cards, all002CardsById } from "./002";
import { all003Cards, all003CardsById } from "./003";
import { all004Cards, all004CardsById } from "./004";
import { all006Cards, all006CardsById } from "./006";
import { all008Cards, all008CardsById } from "./008";
import { all009Cards, all009CardsById } from "./009";
import { all010Cards, all010CardsById } from "./010";
import { all012Cards, all012CardsById } from "./012";
import { all013Cards, all013CardsById } from "./013";
import type { CanonicalCard } from "./types";

export const allCards: CanonicalCard[] = [
  ...all001Cards,
  ...all002Cards,
  ...all003Cards,
  ...all004Cards,
  ...all006Cards,
  ...all008Cards,
  ...all009Cards,
  ...all010Cards,
  ...all012Cards,
  ...all013Cards,
];

export const allCardsById: Record<string, CanonicalCard> = {
  ...all001CardsById,
  ...all002CardsById,
  ...all003CardsById,
  ...all004CardsById,
  ...all006CardsById,
  ...all008CardsById,
  ...all009CardsById,
  ...all010CardsById,
  ...all012CardsById,
  ...all013CardsById,
};
