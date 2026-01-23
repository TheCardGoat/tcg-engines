import type { CharacterCard } from "@tcg/lorcana-types";

export const faunaGoodFairy: CharacterCard = {
  id: "zs9",
  cardType: "character",
  name: "Fauna",
  version: "Good Fairy",
  fullName: "Fauna - Good Fairy",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  cardNumber: 78,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "80f8d403733258ddff42af40cd89a07b1594a58c",
  },
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const faunaGoodFairy: LorcanitoCharacterCard = {
//   id: "y9h",
//   name: "Fauna",
//   title: "Good Fairy",
//   characteristics: ["storyborn", "ally", "fairy"],
//   type: "character",
//   flavour:
//     "The secret to a good cake is combining everything just right. Every ingredient is important, but the magic is in how they work together.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 7,
//   lore: 2,
//   illustrator: "Eri Weli",
//   number: 78,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561167,
//   },
//   rarity: "common",
// };
//
