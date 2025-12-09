import type { CharacterCard } from "@tcg/lorcana";
import * as characters from "./characters";

export const all010Cards: (CharacterCard)[] = [
  ...Object.values(characters),
];

export const all010CardsById: Record<string, CharacterCard> = {};
for (const card of all010Cards) {
  all010CardsById[card.id] = card;
}

export * from "./characters";
