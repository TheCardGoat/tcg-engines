import type { CharacterCard } from "@tcg/lorcana-types";

export const scarFieryUsurper: CharacterCard = {
  id: "yul",
  cardType: "character",
  name: "Scar",
  version: "Fiery Usurper",
  fullName: "Scar - Fiery Usurper",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "001",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  cardNumber: 122,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "7d99fe23e8c2e603315ea08fde248d7d2782459a",
  },
  classifications: ["Dreamborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const scarFieryUsurper: LorcanitoCharacterCard = {
//   id: "fsu",
//   name: "Scar",
//   title: "Fiery Usurper",
//   characteristics: ["dreamborn", "villain"],
//   type: "character",
//   flavour: "Consumed by the flames of ambition.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 5,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Amber Kommavongsa",
//   number: 122,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492711,
//   },
//   rarity: "common",
// };
//
