import { createRecordCardCatalog, type CardCatalog } from "@tcg/shared";
import type { CharacterCard, ActionCard, ItemCard, LocationCard } from "@tcg/lorcana-types";

let allCardsCache: (CharacterCard | ActionCard | ItemCard | LocationCard)[] | null = null;
let allCardsByIdCache: Record<string, CharacterCard | ActionCard | ItemCard | LocationCard> | null =
  null;
let cardCatalogCache: CardCatalog<CharacterCard | ActionCard | ItemCard | LocationCard> | null =
  null;

export async function getAllCards(): Promise<
  (CharacterCard | ActionCard | ItemCard | LocationCard)[]
> {
  if (allCardsCache) return allCardsCache;
  const { allCards } = await import("./catalog-data");
  allCardsCache = allCards;
  return allCardsCache;
}

export async function getAllCardsById(): Promise<
  Record<string, CharacterCard | ActionCard | ItemCard | LocationCard>
> {
  if (allCardsByIdCache) return allCardsByIdCache;
  const { allCardsById } = await import("./catalog-data");
  allCardsByIdCache = allCardsById;
  return allCardsByIdCache;
}

export async function getLorcanaCardCatalog(): Promise<
  CardCatalog<CharacterCard | ActionCard | ItemCard | LocationCard>
> {
  if (cardCatalogCache) return cardCatalogCache;
  cardCatalogCache = createRecordCardCatalog("lorcana:cards", await getAllCardsById());
  return cardCatalogCache;
}

// Export all types
export type {
  AbilityDefinition,
  CanonicalActionCard,
  CanonicalCard,
  CanonicalCardMetadata,
  CanonicalCharacterCard,
  CanonicalItemCard,
  CanonicalLocationCard,
  CardType,
  ExternalIds,
  InkType,
} from "./types";

// Export type guards
export {
  isCanonicalAction,
  isCanonicalCharacter,
  isCanonicalItem,
  isCanonicalLocation,
} from "./types";
