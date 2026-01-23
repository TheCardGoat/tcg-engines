import type { CharacterCard } from "@tcg/lorcana-types";

export const eliLaBouffBigDaddy: CharacterCard = {
  id: "ib2",
  cardType: "character",
  name: "Eli La Bouff",
  version: "Big Daddy",
  fullName: "Eli La Bouff - Big Daddy",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "002",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 179,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "41fb5ac17fe0a5be5e913e0cb5f4a4294a187330",
  },
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const eliLaBouffBigDaddy: LorcanitoCharacterCard = {
//   id: "t92",
//   name: "Eli La Bouff",
//   title: "Big Daddy",
//   characteristics: ["storyborn", "mentor"],
//   type: "character",
//   flavour:
//     "I don't suppose y'all could whip up some more magical beignets with them inkcasters?",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Isaiah Mesq",
//   number: 179,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525267,
//   },
//   rarity: "uncommon",
// };
//
