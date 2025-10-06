import { princeNaveenPennilessRoyal as princeNaveenPennilessRoyalAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/191-prince-naveen-penniless-royal";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeNaveenPennilessRoyal: LorcanitoCharacterCardDefinition = {
  ...princeNaveenPennilessRoyalAsOrig,
  id: "lx6",
  reprints: [princeNaveenPennilessRoyalAsOrig.id],
  number: 182,
  set: "009",
};
