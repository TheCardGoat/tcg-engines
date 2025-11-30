import type { CharacterCard } from "@tcg/lorcana";
import * as characters from "./characters";

export const all008Cards: CharacterCard[] = [...Object.values(characters)];

export const all008CardsById: Record<string, CharacterCard> = {};
for (const card of all008Cards) {
  all008CardsById[card.id] = card;
}

export * from "./characters";
