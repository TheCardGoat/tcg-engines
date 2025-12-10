import type { CharacterCard, ItemCard, LocationCard } from "@tcg/lorcana";
import * as characters from "./characters";
import * as items from "./items";
import * as locations from "./locations";

export const all003Cards: (CharacterCard | ItemCard | LocationCard)[] = [
  ...Object.values(characters),
  ...Object.values(items),
  ...Object.values(locations),
];

export const all003CardsById: Record<
  string,
  CharacterCard | ItemCard | LocationCard
> = {};
for (const card of all003Cards) {
  all003CardsById[card.id] = card;
}

export * from "./characters";
export * from "./items";
export * from "./locations";
