import { elsaSpiritOfWinter as ogElsaSpiritOfWinter } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/042-elsa-spirit-of-winter";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaSpiritOfWinter: LorcanaCharacterCardDefinition = {
  ...ogElsaSpiritOfWinter,
  id: "qun",
  reprints: [ogElsaSpiritOfWinter.id],
  number: 43,
  set: "009",
};
