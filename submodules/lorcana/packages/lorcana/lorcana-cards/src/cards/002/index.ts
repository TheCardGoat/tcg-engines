import type { CharacterCard, ActionCard, ItemCard } from "@tcg/lorcana-types";
import * as characters from "./characters/index";
import * as actions from "./actions/index";
import * as items from "./items/index";

export const all002Cards: (CharacterCard | ActionCard | ItemCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
  ...Object.values(items),
];

export const all002CardsById: Record<string, CharacterCard | ActionCard | ItemCard> = {};
for (const card of all002Cards) {
  all002CardsById[card.id] = card;
}

export * from "./characters/index";
export * from "./actions/index";
export * from "./items/index";
