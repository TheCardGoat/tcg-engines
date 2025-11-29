import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all004Cards: CanonicalCard[] = [...Object.values(characters)];

export const all004CardsById: Record<string, CanonicalCard> = {};
for (const card of all004Cards) {
  all004CardsById[card.id] = card;
}

export * from "./characters";
