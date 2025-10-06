// TODO: Once the set is released, we organize the cards by set and type

import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesUnwaveringDemigod: LorcanaCharacterCardDefinition = {
  id: "f61",
  name: "Hercules",
  title: "Unwavering Demigod",
  characteristics: ["dreamborn", "hero", "prince"],
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  type: "character",
  abilities: [challengerAbility(2)],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Stefano Zanchi",
  number: 180,
  set: "006",
  rarity: "common",
};
