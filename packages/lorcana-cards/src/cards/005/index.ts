import type { ActionCard, CharacterCard, LocationCard } from "@tcg/lorcana";
import * as actions from "./actions";
import * as characters from "./characters";
import * as locations from "./locations";

export const all005Cards: (CharacterCard | ActionCard | LocationCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
  ...Object.values(locations),
];

export const all005CardsById: Record<
  string,
  CharacterCard | ActionCard | LocationCard
> = {};
for (const card of all005Cards) {
  all005CardsById[card.id] = card;
}

export * from "./actions";
export * from "./characters";
export * from "./locations";
