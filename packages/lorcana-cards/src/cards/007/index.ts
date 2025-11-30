import type { CharacterCard } from "@tcg/lorcana";
import * as characters from "./characters";

export const all007Cards: CharacterCard[] = [...Object.values(characters)];

export const all007CardsById: Record<string, CharacterCard> = {};
for (const card of all007Cards) {
  all007CardsById[card.id] = card;
}

export * from "./characters";
