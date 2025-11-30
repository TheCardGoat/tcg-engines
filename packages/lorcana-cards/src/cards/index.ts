import type { CanonicalCard } from "./types";

let allCardsCache: CanonicalCard[] | null = null;
let allCardsByIdCache: Record<string, CanonicalCard> | null = null;

export async function getAllCards(): Promise<CanonicalCard[]> {
  if (allCardsCache) return allCardsCache;
  const { allCards } = await import("./cards");
  allCardsCache = allCards;
  return allCardsCache;
}

export async function getAllCardsById(): Promise<
  Record<string, CanonicalCard>
> {
  if (allCardsByIdCache) return allCardsByIdCache;
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
