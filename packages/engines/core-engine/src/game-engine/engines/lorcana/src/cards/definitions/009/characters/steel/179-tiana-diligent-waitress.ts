import { tianaDiligentWaitress as tianaDiligentWaitressAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/197-tiana-diligent-waitress";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tianaDiligentWaitress: LorcanitoCharacterCardDefinition = {
  ...tianaDiligentWaitressAsOrig,
  id: "ljv",
  reprints: [tianaDiligentWaitressAsOrig.id],
  number: 179,
  set: "009",
};
