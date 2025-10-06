import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const antonioMadrigalAnimalExpert: LorcanitoCharacterCardDefinition = {
  id: "zij",
  name: "Antonio Madrigal",
  title: "Animal Expert",
  characteristics: ["storyborn", "ally", "madrigal"],
  type: "character",
  flavour:
    "Once upon a time, there was a casita in the mountains with a very special family. . . .",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Ellie Horie",
  number: 35,
  set: "URR",
  rarity: "uncommon",
};
