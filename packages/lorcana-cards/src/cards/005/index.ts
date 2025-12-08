import type { CharacterCard } from "@tcg/lorcana";
import * as characters from "./characters";

export const all005Cards: CharacterCard[] = [...Object.values(characters)];

export const all005CardsById: Record<string, CharacterCard> = {};
for (const card of all005Cards) {
  all005CardsById[card.id] = card;
}

export * from "./characters";
