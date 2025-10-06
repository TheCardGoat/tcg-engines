import { herculesBelovedHero as herculesBelovedHeroAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/180-hercules-beloved-hero";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesBelovedHero: LorcanitoCharacterCardDefinition = {
  ...herculesBelovedHeroAsOrig,
  id: "p5o",
  reprints: [herculesBelovedHeroAsOrig.id],
  number: 186,
  set: "009",
};
