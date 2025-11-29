import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all002Cards: CanonicalCard[] = [...Object.values(characters)];

export const all002CardsById: Record<string, CanonicalCard> = {};
for (const card of all002Cards) {
  all002CardsById[card.id] = card;
}

export * from "./characters";
