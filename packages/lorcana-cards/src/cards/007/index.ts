import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all007Cards: CanonicalCard[] = [...Object.values(characters)];

export const all007CardsById: Record<string, CanonicalCard> = {};
for (const card of all007Cards) {
  all007CardsById[card.id] = card;
}

export * from "./characters";
