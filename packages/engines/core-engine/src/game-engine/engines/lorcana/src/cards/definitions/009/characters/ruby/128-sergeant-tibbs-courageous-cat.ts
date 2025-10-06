import { seargentTibbies as sergeantTibbsCourageousCatAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/124-sergeant-tibbs-courageous-cat";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sergeantTibbsCourageousCat: LorcanaCharacterCardDefinition = {
  ...sergeantTibbsCourageousCatAsOrig,
  id: "cz0",
  reprints: [sergeantTibbsCourageousCatAsOrig.id],
  number: 128,
  set: "009",
};
