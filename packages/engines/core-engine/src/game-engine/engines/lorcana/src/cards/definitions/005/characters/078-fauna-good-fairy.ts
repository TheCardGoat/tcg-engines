import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const faunaGoodFairy: LorcanaCharacterCardDefinition = {
  id: "y9h",
  name: "Fauna",
  title: "Good Fairy",
  characteristics: ["storyborn", "ally", "fairy"],
  type: "character",
  flavour:
    "The secret to a good cake is combining everything just right. Every ingredient is important, but the magic is in how they work together.",
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  illustrator: "Eri Weli",
  number: 78,
  set: "SSK",
  rarity: "common",
};
