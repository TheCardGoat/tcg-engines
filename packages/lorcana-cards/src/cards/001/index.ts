import type { ActionCard, CharacterCard } from "@tcg/lorcana";
import * as actions from "./actions";
import * as characters from "./characters";

export const all001Cards: (CharacterCard | ActionCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
];

export const all001CardsById: Record<string, CharacterCard | ActionCard> = {};
for (const card of all001Cards) {
  all001CardsById[card.id] = card;
}

export * from "./actions";
export * from "./characters";
