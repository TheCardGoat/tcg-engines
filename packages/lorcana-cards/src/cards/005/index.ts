import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all005Cards: CanonicalCard[] = [...Object.values(characters)];

export const all005CardsById: Record<string, CanonicalCard> = {};
for (const card of all005Cards) {
  all005CardsById[card.id] = card;
}

export * from "./characters";
