import type { CharacterCard } from "@tcg/lorcana-types";

export const theHornedKingHeartlessDevil: CharacterCard = {
  id: "33o",
  cardType: "character",
  name: "The Horned King",
  version: "Heartless Devil",
  fullName: "The Horned King - Heartless Devil",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 38,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "0b2e0292852ba958299be48fba687444c8216655",
  },
  classifications: ["Storyborn", "Villain", "King", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const theHornedKingHeartlessDevil: LorcanitoCharacterCard = {
//   id: "uxb",
//   name: "The Horned King",
//   title: "Heartless Devil",
//   characteristics: ["storyborn", "villain", "king", "sorcerer"],
//   text: "",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Kevin Sidharta",
//   number: 38,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 657896,
//   },
//   rarity: "common",
//   abilities: [],
//   lore: 1,
// };
//
