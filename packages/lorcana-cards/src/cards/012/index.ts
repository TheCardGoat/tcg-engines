import type { CanonicalCard } from "../types";
import * as characters from "./characters";
import * as locations from "./locations";

export const all012Cards: CanonicalCard[] = [
  ...Object.values(characters),
  ...Object.values(locations),
];

export const all012CardsById: Record<string, CanonicalCard> = {};
for (const card of all012Cards) {
  all012CardsById[card.id] = card;
}

export * from "./characters";
export * from "./locations";
