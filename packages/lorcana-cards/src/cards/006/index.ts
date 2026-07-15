import type { ActionCard, CharacterCard, ItemCard, LocationCard } from "@tcg/lorcana-types";
import * as actions from "./actions";
import * as characters from "./characters";
import * as items from "./items";
import * as locations from "./locations";

export const all006Cards: (CharacterCard | ActionCard | ItemCard | LocationCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
  ...Object.values(items),
  ...Object.values(locations),
];

export const all006CardsById: Record<string, CharacterCard | ActionCard | ItemCard | LocationCard> =
  {};
for (const card of all006Cards) {
  all006CardsById[card.id] = card;
}

export * from "./actions";
export * from "./characters";
export * from "./items";
export * from "./locations";
