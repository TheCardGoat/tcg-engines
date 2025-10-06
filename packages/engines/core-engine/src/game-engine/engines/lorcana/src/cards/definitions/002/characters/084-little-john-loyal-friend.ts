import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const littleJohnLoyalFriend: LorcanitoCharacterCardDefinition = {
  id: "rk6",

  name: "Little John",
  title: "Loyal Friend",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "What's the rush, Rob? Take a load off! There's plenty of time to go lookin' for lore lost in that crazy ink.",
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  illustrator: "Cristian Romero",
  number: 84,
  set: "ROF",
  rarity: "rare",
};
