import { wildcatMechanic as wildcatMechanicAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wildcatMechanic: LorcanaCharacterCardDefinition = {
  ...wildcatMechanicAsOrig,
  id: "lmm",
  reprints: [wildcatMechanicAsOrig.id],
  number: 91,
  set: "009",
};
