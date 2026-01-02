import type { ActionCard, CharacterCard } from "@tcg/lorcana-types";
import * as actions from "./actions";
import * as characters from "./characters";

export const all008Cards: (CharacterCard | ActionCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
];

export const all008CardsById: Record<string, CharacterCard | ActionCard> = {};
for (const card of all008Cards) {
  all008CardsById[card.id] = card;
}

export * from "./actions";
export * from "./characters";
