import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const eliLaBouffBigDaddy: LorcanitoCharacterCardDefinition = {
  id: "t92",
  name: "Eli La Bouff",
  title: "Big Daddy",
  characteristics: ["storyborn", "mentor"],
  type: "character",
  flavour:
    "I don't suppose y'all could whip up some more magical beignets with them inkcasters?",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  illustrator: "Isaiah Mesq",
  number: 179,
  set: "ROF",
  rarity: "uncommon",
};
