import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all009Cards: CanonicalCard[] = [...Object.values(characters)];

export const all009CardsById: Record<string, CanonicalCard> = {};
for (const card of all009Cards) {
  all009CardsById[card.id] = card;
}

export * from "./characters";
