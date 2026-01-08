import type { CharacterCard } from "@tcg/lorcana-types";

export const floraGoodFairy: CharacterCard = {
  id: "awe",
  cardType: "character",
  name: "Flora",
  version: "Good Fairy",
  fullName: "Flora - Good Fairy",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  text: "FIDDLE FADDLE While being challenged, this character gets +2 {S}.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 75,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2748ac33fb9196c968a8b393fdd03e40908589e4",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { reverseChallenge } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const floraGoodFairy: LorcanitoCharacterCard = {
//   id: "bw1",
//   missingTestCase: true,
//   name: "Flora",
//   title: "Good Fairy",
//   characteristics: ["storyborn", "ally", "fairy"],
//   text: "**FIDDLE FADDLE** While being challenged, this character gets +2 {S}.",
//   type: "character",
//   abilities: [reverseChallenge("Fiddle Faddle", 2)],
//   flavour:
//     "Don't fuss, dear! A flick of the wrist will turn these briars into something beautiful.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Eri Weli",
//   number: 75,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560641,
//   },
//   rarity: "common",
// };
//
