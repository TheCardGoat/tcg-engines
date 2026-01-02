import type { CharacterCard, ItemCard, LocationCard } from "@tcg/lorcana-types";
import * as characters from "./characters";
import * as items from "./items";
import * as locations from "./locations";

export const all009Cards: (CharacterCard | ItemCard | LocationCard)[] = [
  ...Object.values(characters),
  ...Object.values(items),
  ...Object.values(locations),
];

export const all009CardsById: Record<
  string,
  CharacterCard | ItemCard | LocationCard
> = {};
for (const card of all009Cards) {
  all009CardsById[card.id] = card;
}

export * from "./characters";
export * from "./items";
export * from "./locations";
