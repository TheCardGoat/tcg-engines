import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurWart: CharacterCard = {
  id: "1t0",
  cardType: "character",
  name: "Arthur",
  version: "Wart",
  fullName: "Arthur - Wart",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 190,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "ea4fccb865562f690c50de02ff9e7d716e781197",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const arthurWart: LorcanitoCharacterCard = {
//   id: "szj",
//   name: "Arthur",
//   title: "Wart",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour:
//     "That boy's get real spark. Lots of spirit. Throws himself heart and soul into everything he does.\n−Merlin",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Kasia Brzezinska",
//   number: 190,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561298,
//   },
//   rarity: "uncommon",
// };
//
