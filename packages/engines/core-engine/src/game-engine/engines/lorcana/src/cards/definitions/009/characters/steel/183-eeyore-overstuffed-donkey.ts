import { eeyoreOverstuffedDonkey as eeyoreOverstuffedDonkeyAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/172-eeyore-overstuffed-donkey";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const eeyoreOverstuffedDonkey: LorcanitoCharacterCardDefinition = {
  ...eeyoreOverstuffedDonkeyAsOrig,
  id: "k3s",
  reprints: [eeyoreOverstuffedDonkeyAsOrig.id],
  number: 183,
  set: "009",
};
