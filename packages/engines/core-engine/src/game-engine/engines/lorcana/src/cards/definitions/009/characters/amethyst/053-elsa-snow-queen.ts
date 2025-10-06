import { elsaSnowQueen as elsaSnowQueenAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/041-elsa-snow-queen";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaSnowQueen: LorcanaCharacterCardDefinition = {
  ...elsaSnowQueenAsOrig,
  id: "hcz",
  reprints: [elsaSnowQueenAsOrig.id],
  number: 53,
  set: "009",
};
