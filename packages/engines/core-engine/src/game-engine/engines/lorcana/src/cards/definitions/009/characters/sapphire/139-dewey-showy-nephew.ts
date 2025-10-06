import { deweyShowyNephew as deweyShowyNephewAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const deweyShowyNephew: LorcanaCharacterCardDefinition = {
  ...deweyShowyNephewAsOrig,
  id: "kyd",
  reprints: [deweyShowyNephewAsOrig.id],
  number: 139,
  set: "009",
};
