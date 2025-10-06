import { annaBravingTheStorm as ogAnnaBravingTheStorm } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/137-anna-braving-the-storm";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaBravingTheStorm: LorcanaCharacterCardDefinition = {
  ...ogAnnaBravingTheStorm,
  id: "ads", // New ID for this card
  reprints: [ogAnnaBravingTheStorm.id],
  number: 146,
  set: "009",
};
