import type { CharacterCard, ActionCard, ItemCard } from "@tcg/lorcana-types";
import * as characters from "./characters";
import * as actions from "./actions";
import * as items from "./items";

export const all001Cards: (CharacterCard | ActionCard | ItemCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
  ...Object.values(items),
];

export const all001CardsById: Record<string, CharacterCard | ActionCard | ItemCard> = {};
for (const card of all001Cards) {
  all001CardsById[card.id] = card;
}

export * from "./characters";
export * from "./actions";
export * from "./items";
