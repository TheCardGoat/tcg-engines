import type { ActionCard, CharacterCard, ItemCard } from "@tcg/lorcana";
import * as actions from "./actions";
import * as characters from "./characters";
import * as items from "./items";

export const all010Cards: (CharacterCard | ActionCard | ItemCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
  ...Object.values(items),
];

export const all010CardsById: Record<
  string,
  CharacterCard | ActionCard | ItemCard
> = {};
for (const card of all010Cards) {
  all010CardsById[card.id] = card;
}

export * from "./actions";
export * from "./characters";
export * from "./items";
