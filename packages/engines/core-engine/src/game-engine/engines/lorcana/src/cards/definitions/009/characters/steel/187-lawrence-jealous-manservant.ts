import { lawrenceJealousManservant as lawrenceJealousManservantAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/186-lawrence-jealous-manservant";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lawrenceJealousManservant: LorcanitoCharacterCardDefinition = {
  ...lawrenceJealousManservantAsOrig,
  id: "b85",
  reprints: [lawrenceJealousManservantAsOrig.id],
  number: 187,
  set: "009",
};
