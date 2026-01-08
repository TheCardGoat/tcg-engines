import type { CharacterCard } from "@tcg/lorcana-types";

export const theFatesOnlyOneEye: CharacterCard = {
  id: "18e",
  cardType: "character",
  name: "The Fates",
  version: "Only One Eye",
  fullName: "The Fates - Only One Eye",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "ALL WILL BE SEEN When you play this character, look at the top card of each opponent's deck.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 89,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a006d6c335ba5f1e0446f91c16ab10467268b77b",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const theFatesOnlyOneEye: LorcanitoCharacterCard = {
//   id: "k7n",
//   missingTestCase: true,
//   name: "The Fates",
//   title: "Only One Eye",
//   characteristics: ["storyborn", "ally"],
//   text: "**ALL WILL BE SEEN** When you play this character, look at the top card of each opponent's deck.",
//   type: "character",
//   abilities: [],
//   flavour: "We know everything.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 2,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Jon Densk / Hayley Evans",
//   number: 89,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550582,
//   },
//   rarity: "common",
// };
//
