import type { CanonicalCard } from "../types";
import * as characters from "./characters";

export const all001Cards: CanonicalCard[] = [...Object.values(characters)];

export const all001CardsById: Record<string, CanonicalCard> = {};
for (const card of all001Cards) {
  all001CardsById[card.id] = card;
}

export * from "./characters";
