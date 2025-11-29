import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all013Cards: CanonicalCard[] = [...Object.values(characters)];

export const all013CardsById: Record<string, CanonicalCard> = {};
for (const card of all013Cards) {
  all013CardsById[card.id] = card;
}

export * from "./characters";
