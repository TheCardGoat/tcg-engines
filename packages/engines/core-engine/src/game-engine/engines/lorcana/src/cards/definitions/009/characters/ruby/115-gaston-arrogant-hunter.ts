import { gastonArrogantHunter as gastonArrogantHunterAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/110-gaston-arrogant-hunter";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gastonArrogantHunter: LorcanitoCharacterCardDefinition = {
  ...gastonArrogantHunterAsOrig,
  id: "k2n",
  reprints: [gastonArrogantHunterAsOrig.id],
  number: 115,
  set: "009",
};
