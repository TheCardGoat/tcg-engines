import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dukeWeaseltonSmallTimeCrook: LorcanaCharacterCardDefinition = {
  id: "b5u",

  name: "Duke Weaselton",
  title: "Small-Time Crook",
  characteristics: ["storyborn"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_",
  type: "character",
  abilities: [wardAbility],
  flavour: "It's Wee-sel-ton.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  illustrator: "Rosa la Barbera / Leonardo Giammichele",
  number: 146,
  set: "ROF",
  rarity: "common",
};
