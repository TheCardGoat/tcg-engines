import type { CharacterCard } from "@tcg/lorcana";
import * as characters from "./characters";

export const all004Cards: CharacterCard[] = [...Object.values(characters)];

export const all004CardsById: Record<string, CharacterCard> = {};
for (const card of all004Cards) {
  all004CardsById[card.id] = card;
}

export * from "./characters";
