import type { CharacterCard, ActionCard, ItemCard, LocationCard } from "@tcg/lorcana-types";
import * as characters from "./characters";
import * as actions from "./actions";
import * as items from "./items";
import * as locations from "./locations";

export const all012Cards: (CharacterCard | ActionCard | ItemCard | LocationCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
  ...Object.values(items),
  ...Object.values(locations),
];

export const all012CardsById: Record<string, CharacterCard | ActionCard | ItemCard | LocationCard> =
  {};
for (const card of all012Cards) {
  all012CardsById[card.id] = card;
}

export * from "./characters";
export * from "./actions";
export * from "./items";
export * from "./locations";
