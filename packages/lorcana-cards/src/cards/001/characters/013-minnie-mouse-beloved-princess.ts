import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseBelovedPrincess: CharacterCard = {
  id: "1h4",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Beloved Princess",
  fullName: "Minnie Mouse - Beloved Princess",
  inkType: ["amber"],
  set: "001",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 13,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "c1441a9388ffdf1a914448f9272ae60e6e971869",
  },
  classifications: ["Dreamborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const minnieMouseBelovedPrincess: LorcanitoCharacterCard = {
//   id: "ycw",
//
//   name: "Minnie Mouse",
//   title: "Beloved Princess",
//   characteristics: ["dreamborn", "princess"],
//   type: "character",
//   flavour:
//     "Wherever the princess goes, her musketeers are. . . well, they're around somewhere, probably.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kendall Hale",
//   number: 13,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493498,
//   },
//   rarity: "common",
// };
//
