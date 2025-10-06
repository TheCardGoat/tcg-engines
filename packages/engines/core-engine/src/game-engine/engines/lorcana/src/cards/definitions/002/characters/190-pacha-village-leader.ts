import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pachaVillageLeader: LorcanaCharacterCardDefinition = {
  id: "lxx",

  name: "Pacha",
  title: "Village Leader",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour: "Don't be fooled by the folksy peasant look. \n−Kuzco",
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 4,
  willpower: 8,
  lore: 2,
  illustrator: "Koni",
  number: 190,
  set: "ROF",
  rarity: "uncommon",
};
