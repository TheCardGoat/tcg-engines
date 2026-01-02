import type { CharacterCard } from "@tcg/lorcana-types";
import * as characters from "./characters";

export const all002Cards: CharacterCard[] = [...Object.values(characters)];

export const all002CardsById: Record<string, CharacterCard> = {};
for (const card of all002Cards) {
  all002CardsById[card.id] = card;
}

export * from "./characters";
