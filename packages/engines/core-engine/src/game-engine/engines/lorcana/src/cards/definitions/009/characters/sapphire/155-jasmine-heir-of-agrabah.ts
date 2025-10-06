import { jasmineHeirOfAgrabah as jasmineHeirOfAgrabahAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/151-jasmine-heir-of-agrabah";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineHeirOfAgrabah: LorcanitoCharacterCardDefinition = {
  ...jasmineHeirOfAgrabahAsOrig,
  id: "cqu",
  reprints: [jasmineHeirOfAgrabahAsOrig.id],
  number: 155,
  set: "009",
};
