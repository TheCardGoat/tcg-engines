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

export type { CanonicalCard } from "./types";
