import type { CharacterCard, ItemCard, LocationCard } from "@tcg/lorcana";
import * as characters from "./characters";
import * as items from "./items";
import * as locations from "./locations";

export const all010Cards: (CharacterCard | ItemCard | LocationCard)[] = [
  ...Object.values(characters),
  ...Object.values(items),
  ...Object.values(locations),
];

export const all010CardsById: Record<
  string,
  CharacterCard | ItemCard | LocationCard
> = {};
for (const card of all010Cards) {
  all010CardsById[card.id] = card;
}

export * from "./characters";
export * from "./items";
export * from "./locations";
