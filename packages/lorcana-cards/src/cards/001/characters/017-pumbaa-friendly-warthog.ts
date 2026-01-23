import type { CharacterCard } from "@tcg/lorcana-types";

export const pumbaaFriendlyWarthog: CharacterCard = {
  id: "e5b",
  cardType: "character",
  name: "Pumbaa",
  version: "Friendly Warthog",
  fullName: "Pumbaa - Friendly Warthog",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 17,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "32fd3b35af3bf2b32dc0ef71e6096d08e28b2b30",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const pumbaFriendlyWarhog: LorcanitoCharacterCard = {
//   id: "b1f",
//   name: "Pumbaa",
//   title: "Friendly Warthog",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "You gotta put your behind in your past.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Jenna Gray",
//   number: 17,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508701,
//   },
//   rarity: "common",
// };
//
