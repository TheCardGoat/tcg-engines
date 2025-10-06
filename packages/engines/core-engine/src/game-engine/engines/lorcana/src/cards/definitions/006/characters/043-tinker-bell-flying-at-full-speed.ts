// TODO: Once the set is released, we organize the cards by set and type

import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellFlyingAtFullSpeed: LorcanaCharacterCardDefinition = {
  id: "uya",
  name: "Tinker Bell",
  title: "Fast Flier",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  type: "character",
  abilities: [evasiveAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  illustrator: "Malia Ewart",
  number: 43,
  set: "006",
  rarity: "common",
};
