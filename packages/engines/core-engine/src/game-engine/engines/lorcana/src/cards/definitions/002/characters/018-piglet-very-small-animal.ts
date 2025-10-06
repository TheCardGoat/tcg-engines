import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pigletVerySmallAnimal: LorcanitoCharacterCardDefinition = {
  id: "d7w",
  name: "Piglet",
  title: "Very Small Animal",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "For a very small animal, he has an awfully big heart.",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Kiersten Hale",
  number: 18,
  set: "ROF",
  rarity: "common",
};
