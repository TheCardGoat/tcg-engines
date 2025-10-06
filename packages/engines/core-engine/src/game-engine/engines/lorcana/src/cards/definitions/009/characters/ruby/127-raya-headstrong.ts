import { rayaHeadstrong as rayaHeadstrongAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/122-raya-headstrong";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaHeadstrong: LorcanaCharacterCardDefinition = {
  ...rayaHeadstrongAsOrig,
  id: "g6t",
  reprints: [rayaHeadstrongAsOrig.id],
  number: 127,
  set: "009",
};
