import type { CharacterCard } from "@tcg/lorcana-types";

export const tamatoaDrabLittleCrab: CharacterCard = {
  id: "12d",
  cardType: "character",
  name: "Tamatoa",
  version: "Drab Little Crab",
  fullName: "Tamatoa - Drab Little Crab",
  inkType: ["emerald"],
  franchise: "Moana",
  set: "001",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 92,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "8a4c535c40d66910291c4f04f91b676ad823c1c3",
  },
  classifications: ["Dreamborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const tamatoaDrabLittleCrab: LorcanitoCharacterCard = {
//   id: "pme",
//   name: "Tamatoa",
//   title: "Drab Little Crab",
//   characteristics: ["dreamborn"],
//   type: "character",
//   flavour:
//     "Someday, I'll grow up to be the most crabulous crustacean the world has ever seen!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Jeff Murchie",
//   number: 92,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508774,
//   },
//   rarity: "uncommon",
// };
//
