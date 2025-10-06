import { cardSoldiersFullDeck as cardSoldiersFullDeckAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/105-card-soldiers-full-deck";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cardSoldiersFullDeck: LorcanaCharacterCardDefinition = {
  ...cardSoldiersFullDeckAsOrig,
  id: "yi4",
  reprints: [cardSoldiersFullDeckAsOrig.id],
  number: 122,
  set: "009",
};
