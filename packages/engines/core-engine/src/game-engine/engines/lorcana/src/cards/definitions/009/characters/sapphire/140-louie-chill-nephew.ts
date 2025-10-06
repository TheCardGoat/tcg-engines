import { louieChillNephew as louieChillNephewAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const louieChillNephew: LorcanaCharacterCardDefinition = {
  ...louieChillNephewAsOrig,
  id: "pec",
  reprints: [louieChillNephewAsOrig.id],
  number: 140,
  set: "009",
};
