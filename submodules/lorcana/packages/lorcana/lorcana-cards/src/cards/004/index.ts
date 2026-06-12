import type { CharacterCard, ActionCard, ItemCard, LocationCard } from "@tcg/lorcana-types";
import * as characters from "./characters/index";
import * as actions from "./actions/index";
import * as items from "./items/index";
import * as locations from "./locations/index";

export const all004Cards: (CharacterCard | ActionCard | ItemCard | LocationCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
  ...Object.values(items),
  ...Object.values(locations),
];

export const all004CardsById: Record<string, CharacterCard | ActionCard | ItemCard | LocationCard> =
  {};
for (const card of all004Cards) {
  all004CardsById[card.id] = card;
}

export * from "./characters/index";
export * from "./actions/index";
export * from "./items/index";
export * from "./locations/index";
