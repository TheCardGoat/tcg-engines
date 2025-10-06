import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gusChampionOfCheese: LorcanitoCharacterCardDefinition = {
  id: "zja",
  name: "Gus",
  title: "Champion of Cheese",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "You can always rely on him when it comes to cheese.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Maddie Shilt",
  number: 73,
  set: "URR",
  rarity: "common",
};
