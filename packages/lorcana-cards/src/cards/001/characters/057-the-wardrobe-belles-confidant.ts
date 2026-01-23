import type { CharacterCard } from "@tcg/lorcana-types";

export const theWardrobeBellesConfidant: CharacterCard = {
  id: "1s4",
  cardType: "character",
  name: "The Wardrobe",
  version: "Belle’s Confidant",
  fullName: "The Wardrobe - Belle’s Confidant",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "001",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 57,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "e8b7912c61ab4cfa9b8e401d6d8cf06846c4f12a",
  },
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const theWardrobeBelleConfident: LorcanitoCharacterCard = {
//   id: "qvy",
//
//   name: "The Wardrobe",
//   title: "Belle's Confidant",
//   characteristics: ["dreamborn", "ally"],
//   type: "character",
//   flavour: "When you simply must have the hautest couture.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Giulia Riva",
//   number: 57,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 485363,
//   },
//   rarity: "common",
// };
//
