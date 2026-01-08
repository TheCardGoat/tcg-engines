import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentUninvited: CharacterCard = {
  id: "tio",
  cardType: "character",
  name: "Maleficent",
  version: "Uninvited",
  fullName: "Maleficent - Uninvited",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 151,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "6a637ad79b7ce9fad777fb8a1163379b2f2e1f9e",
  },
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const maleficentUninvited: LorcanitoCharacterCard = {
//   id: "ncw",
//
//   name: "Maleficent",
//   title: "Uninvited",
//   characteristics: ["dreamborn", "sorcerer", "villain"],
//   type: "character",
//   flavour: "She had no invitation−and needed no introduction.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 3,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Gaku Kumatori",
//   number: 151,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505949,
//   },
//   rarity: "rare",
// };
//
