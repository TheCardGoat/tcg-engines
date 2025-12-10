import type { CharacterCard, ItemCard } from "@tcg/lorcana";
import * as characters from "./characters";
import * as items from "./items";

export const all002Cards: (CharacterCard | ItemCard)[] = [
  ...Object.values(characters),
  ...Object.values(items),
];

export const all002CardsById: Record<string, CharacterCard | ItemCard> = {};
for (const card of all002Cards) {
  all002CardsById[card.id] = card;
}

export * from "./characters";
export * from "./items";
