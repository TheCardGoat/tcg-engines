import { hadesInfernalSchemer as hadesInfernalSchemerAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/147-hades-infernal-schemer";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hadesInfernalSchemer: LorcanitoCharacterCardDefinition = {
  ...hadesInfernalSchemerAsOrig,
  id: "a03",
  reprints: [hadesInfernalSchemerAsOrig.id],
  number: 151,
  set: "009",
};
