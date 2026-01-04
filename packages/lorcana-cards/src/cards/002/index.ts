import type { ActionCard, CharacterCard } from "@tcg/lorcana-types";
import * as actions from "./actions";
import * as characters from "./characters";

export const all002Cards: (CharacterCard | ActionCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
];

export const all002CardsById: Record<string, CharacterCard | ActionCard> = {};
for (const card of all002Cards) {
  all002CardsById[card.id] = card;
}

export * from "./actions";
export * from "./characters";
