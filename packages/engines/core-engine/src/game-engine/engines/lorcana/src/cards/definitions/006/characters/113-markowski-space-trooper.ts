// TODO: Once the set is released, we organize the cards by set and type

import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const markowskiSpaceTrooper: LorcanaCharacterCardDefinition = {
  id: "okv",
  name: "Markowski",
  title: "Space Trooper",
  characteristics: ["storyborn", "ally"],
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  type: "character",
  abilities: [evasiveAbility],
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  illustrator: "Kevin Sidharta",
  number: 113,
  set: "006",
  rarity: "common",
};
