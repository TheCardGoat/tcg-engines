import { auroraRegalPrincess as auroraRegalPrincessAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraRegalPrincess: LorcanitoCharacterCardDefinition = {
  ...auroraRegalPrincessAsOrig,
  id: "gc3",
  reprints: [auroraRegalPrincessAsOrig.id],
  number: 161,
  set: "009",
};
