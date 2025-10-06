import { pegasusGiftForHercules as pegasusGiftForHerculesAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/084-pegasus-gift-for-hercules";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pegasusGiftForHercules: LorcanitoCharacterCardDefinition = {
  ...pegasusGiftForHerculesAsOrig,
  id: "w64",
  reprints: [pegasusGiftForHerculesAsOrig.id],
  number: 84,
  set: "009",
};
