import type { ActionCard, CharacterCard } from "@tcg/lorcana";
import * as actions from "./actions";
import * as characters from "./characters";

export const all005Cards: (CharacterCard | ActionCard)[] = [
  ...Object.values(characters),
  ...Object.values(actions),
];

export const all005CardsById: Record<string, CharacterCard | ActionCard> = {};
for (const card of all005Cards) {
  all005CardsById[card.id] = card;
}

export * from "./actions";
export * from "./characters";
