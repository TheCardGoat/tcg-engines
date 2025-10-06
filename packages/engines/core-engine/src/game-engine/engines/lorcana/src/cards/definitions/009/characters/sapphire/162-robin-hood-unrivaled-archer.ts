import { robinHoodUnrivaledArcher as robinHoodUnrivaledArcherAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodUnrivaledArcher: LorcanaCharacterCardDefinition = {
  ...robinHoodUnrivaledArcherAsOrig,
  id: "l10",
  reprints: [robinHoodUnrivaledArcherAsOrig.id],
  number: 162,
  set: "009",
};
