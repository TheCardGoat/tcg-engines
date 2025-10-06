import { aladdinPrinceAli as aladdinPrinceAliAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/069-aladdin-prince-ali";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aladdinPrinceAli: LorcanitoCharacterCardDefinition = {
  ...aladdinPrinceAliAsOrig,
  id: "n78",
  reprints: [aladdinPrinceAliAsOrig.id],
  number: 92,
  set: "009",
};
