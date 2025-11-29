import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all006Cards: CanonicalCard[] = [...Object.values(characters)];

export const all006CardsById: Record<string, CanonicalCard> = {};
for (const card of all006Cards) {
  all006CardsById[card.id] = card;
}

export * from "./characters";
