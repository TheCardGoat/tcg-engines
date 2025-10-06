import { mickeyMouseTrumpeter as mickeyMouseTrumpeterAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseTrumpeter: LorcanitoCharacterCardDefinition = {
  ...mickeyMouseTrumpeterAsOrig,
  id: "ftq",
  reprints: [mickeyMouseTrumpeterAsOrig.id],
  number: 172,
  set: "009",
};
