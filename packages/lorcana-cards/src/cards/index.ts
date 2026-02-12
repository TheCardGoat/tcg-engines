import type { ActionCard, CharacterCard, ItemCard, LocationCard } from "@tcg/lorcana-types";

let allCardsCache: (CharacterCard | ActionCard | ItemCard | LocationCard)[] | null = null;
let allCardsByIdCache: Record<string, CharacterCard | ActionCard | ItemCard | LocationCard> | null =
  null;

export async function getAllCards(): Promise<
  (CharacterCard | ActionCard | ItemCard | LocationCard)[]
> {
  if (allCardsCache) {
    return allCardsCache;
  }
  const { allCards } = await import("./cards");
  allCardsCache = allCards;
  return allCardsCache;
}

export async function getAllCardsById(): Promise<
  Record<string, CharacterCard | ActionCard | ItemCard | LocationCard>
> {
  if (allCardsByIdCache) {
    return allCardsByIdCache;
  }
  const { allCardsById } = await import("./cards");
  allCardsByIdCache = allCardsById;
  return allCardsByIdCache;
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
  CardPrintingRef,
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
