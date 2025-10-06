import { queenOfHeartsImpulsiveRuler as queenOfHeartsImpulsiveRulerAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/119-queen-of-hearts-impulsive-ruler";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queenOfHeartsImpulsiveRuler: LorcanaCharacterCardDefinition = {
  ...queenOfHeartsImpulsiveRulerAsOrig,
  id: "tge",
  reprints: [queenOfHeartsImpulsiveRulerAsOrig.id],
  number: 123,
  set: "009",
};
