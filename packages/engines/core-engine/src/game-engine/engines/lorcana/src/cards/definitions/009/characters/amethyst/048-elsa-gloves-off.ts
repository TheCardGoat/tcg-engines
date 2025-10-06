import { elsaGlovesOff as ogElsaGlovesOff } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/039-elsa-gloves-off";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaGlovesOff: LorcanitoCharacterCardDefinition = {
  ...ogElsaGlovesOff,
  id: "b83", // New ID for this card
  reprints: [ogElsaGlovesOff.id],
  number: 48,
  set: "009",
};
