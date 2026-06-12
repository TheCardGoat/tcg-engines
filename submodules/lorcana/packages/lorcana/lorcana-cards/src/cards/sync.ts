import { createRecordCardCatalog, type CardCatalog } from "@tcg/shared";
import type { CharacterCard, ActionCard, ItemCard, LocationCard } from "@tcg/lorcana-types";
import { allCards, allCardsById } from "./catalog-data";

let cardCatalogCache: CardCatalog<CharacterCard | ActionCard | ItemCard | LocationCard> | null =
  null;

export function getAllCardsSync(): (CharacterCard | ActionCard | ItemCard | LocationCard)[] {
  return allCards;
}

export function getAllCardsByIdSync(): Record<
  string,
  CharacterCard | ActionCard | ItemCard | LocationCard
> {
  return allCardsById;
}

export function getLorcanaCardCatalogSync(): CardCatalog<
  CharacterCard | ActionCard | ItemCard | LocationCard
> {
  if (cardCatalogCache) return cardCatalogCache;
  cardCatalogCache = createRecordCardCatalog("lorcana:cards", allCardsById);
  return cardCatalogCache;
}
