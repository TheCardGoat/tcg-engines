import type { GundamitoCard } from "./cardTypes";
import { allCardsGD01Cards, allCardsGD01CardsById } from "./GD01";
import { allCardsST01Cards, allCardsST01CardsById } from "./ST01";
import { allCardsST02Cards, allCardsST02CardsById } from "./ST02";
import { allCardsST04Cards, allCardsST04CardsById } from "./ST04";
import { exBaseToken, exResourceToken } from "./tokens/tokens";

export const allGundamCards: GundamitoCard[] = [
  ...allCardsGD01Cards,
  ...allCardsST01Cards,
  ...allCardsST02Cards,
  ...allCardsST04Cards,
  exBaseToken,
  exResourceToken,
];
export const allGundamCardsById: Record<string, GundamitoCard> = {
  ...allCardsGD01CardsById,
  ...allCardsST01CardsById,
  ...allCardsST02CardsById,
  ...allCardsST04CardsById,
  [exBaseToken.id]: exBaseToken,
  [exResourceToken.id]: exResourceToken,
};

export const allCards: GundamitoCard[] = [...allGundamCards];

export const getGundamitoCardById = (id: string): GundamitoCard | undefined => {
  return allGundamCardsById[id];
};
