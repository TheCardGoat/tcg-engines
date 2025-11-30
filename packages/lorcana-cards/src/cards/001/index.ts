import type { CharacterCard } from "@tcg/lorcana";
import * as characters from "./characters";

export const all001Cards: CharacterCard[] = [...Object.values(characters)];

export const all001CardsById: Record<string, CharacterCard> = {};
for (const card of all001Cards) {
  all001CardsById[card.id] = card;
}

export * from "./characters";
