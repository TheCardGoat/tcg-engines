import type { CharacterCard } from "@tcg/lorcana-types";

export const hansSchemingPrince: CharacterCard = {
  id: "11k",
  cardType: "character",
  name: "Hans",
  version: "Scheming Prince",
  fullName: "Hans - Scheming Prince",
  inkType: ["emerald"],
  franchise: "Frozen",
  set: "001",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 3,
  cardNumber: 78,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "876b55e02b4709468c83197733991be728f92bfd",
  },
  classifications: ["Storyborn", "Villain", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hansSchemingPrince: LorcanitoCharacterCard = {
//   id: "s45",
//   name: "Hans",
//   title: "Scheming Prince",
//   characteristics: ["storyborn", "villain", "prince"],
//   type: "character",
//   flavour: "Rules are like older siblings. All they do is get in the way.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 3,
//   illustrator: "Massimiliano Narciso",
//   number: 78,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505954,
//   },
//   rarity: "rare",
// };
//
