import { robinHoodChampionOfSherwood as robinHoodChampionOfSherwoodAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodChampionOfSherwood: LorcanitoCharacterCardDefinition = {
  ...robinHoodChampionOfSherwoodAsOrig,
  id: "mfa",
  reprints: [robinHoodChampionOfSherwoodAsOrig.id],
  number: 177,
  set: "009",
};
