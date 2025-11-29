import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all008Cards: CanonicalCard[] = [...Object.values(characters)];

export const all008CardsById: Record<string, CanonicalCard> = {};
for (const card of all008Cards) {
  all008CardsById[card.id] = card;
}

export * from "./characters";
