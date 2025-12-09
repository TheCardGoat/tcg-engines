import type { CharacterCard, ActionCard, ItemCard, LocationCard } from "@tcg/lorcana";
import { all010Cards, all010CardsById } from "./010";

export const allCards: (CharacterCard | ActionCard | ItemCard | LocationCard)[] = [
  ...all010Cards,
];

export const allCardsById: Record<string, CharacterCard | ActionCard | ItemCard | LocationCard> = {
  ...all010CardsById,
};
