import type { CharacterCard, LocationCard } from "@tcg/lorcana";
import * as characters from "./characters";
import * as locations from "./locations";

export const all009Cards: (CharacterCard | LocationCard)[] = [
  ...Object.values(characters),
  ...Object.values(locations),
];

export const all009CardsById: Record<string, CharacterCard | LocationCard> = {};
for (const card of all009Cards) {
  all009CardsById[card.id] = card;
}

export * from "./characters";
export * from "./locations";
