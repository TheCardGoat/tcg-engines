import type { LorcanitoCard } from "@lorcanito/lorcana-engine";

let allCardsCache: LorcanitoCard[] | null = null;
let allCardsByIdCache: Record<string, LorcanitoCard> | null = null;

export async function getAllCards() {
  if (allCardsCache) {
    return allCardsCache;
  }

  // This creates a separate chunk for the large JSON
  const importedData = await import("./cards");
  allCardsCache = importedData.allCards;

  return allCardsCache;
}

export async function getAllCardsById() {
  if (allCardsByIdCache) {
    return allCardsByIdCache;
  }

  // This creates a separate chunk for the large JSON
  const importedData = await import("./cards");
  allCardsByIdCache = importedData.allCardsById;

  return allCardsByIdCache;
}
