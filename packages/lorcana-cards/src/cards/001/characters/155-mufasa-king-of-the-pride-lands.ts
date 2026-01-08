import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaKingOfThePrideLands: CharacterCard = {
  id: "py9",
  cardType: "character",
  name: "Mufasa",
  version: "King of the Pride Lands",
  fullName: "Mufasa - King of the Pride Lands",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  cardNumber: 155,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn", "King", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mufasaKingOfProudLands: LorcanitoCharacterCard = {
//   id: "py9",
//   reprints: ["adw"],
//
//   name: "Mufasa",
//   title: "King of the Pride Lands",
//   characteristics: ["storyborn", "king", "mentor"],
//   type: "character",
//   flavour:
//     "A king must care for all of the creatures in his kingdom, no matter their size.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 4,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Luis Huerta",
//   number: 155,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508868,
//   },
//   rarity: "common",
// };
//
