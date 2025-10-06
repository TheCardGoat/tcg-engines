import { sisuEmboldenedWarrior as sisuEmboldenedWarriorAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/124-sisu-emboldened-warrior";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sisuEmboldenedWarrior: LorcanitoCharacterCardDefinition = {
  ...sisuEmboldenedWarriorAsOrig,
  id: "g9x",
  reprints: [sisuEmboldenedWarriorAsOrig.id],
  number: 118,
  set: "009",
};
