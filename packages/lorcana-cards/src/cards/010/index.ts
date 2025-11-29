import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all010Cards: CanonicalCard[] = [...Object.values(characters)];

export const all010CardsById: Record<string, CanonicalCard> = {};
for (const card of all010Cards) {
  all010CardsById[card.id] = card;
}

export * from "./characters";
