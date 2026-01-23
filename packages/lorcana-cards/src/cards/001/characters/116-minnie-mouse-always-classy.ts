import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseAlwaysClassy: CharacterCard = {
  id: "wo8",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Always Classy",
  fullName: "Minnie Mouse - Always Classy",
  inkType: ["ruby"],
  set: "001",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 116,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "75c1ac4c95df0e008ea454975ee2641680d4f4c0",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const minniMouseAlwaysClassy: LorcanitoCharacterCard = {
//   id: "nwa",
//
//   name: "Minnie Mouse",
//   title: "Always Classy",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour: "Her fashion sense is always spot on.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kenneth Anderson",
//   number: 116,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505967,
//   },
//   rarity: "common",
// };
//
