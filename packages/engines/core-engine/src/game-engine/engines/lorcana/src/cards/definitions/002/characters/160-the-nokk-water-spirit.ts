import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theNokkWaterSpirit: LorcanaCharacterCardDefinition = {
  id: "vrs",

  name: "The Nokk",
  title: "Water Spirit",
  characteristics: ["storyborn"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_",
  type: "character",
  abilities: [wardAbility],
  flavour: "As elusive as water.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "Hadjie Joos",
  number: 160,
  set: "ROF",
  rarity: "common",
};
