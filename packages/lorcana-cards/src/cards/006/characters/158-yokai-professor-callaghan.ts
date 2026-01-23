import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiProfessorCallaghan: CharacterCard = {
  id: "urh",
  cardType: "character",
  name: "Yokai",
  version: "Professor Callaghan",
  fullName: "Yokai - Professor Callaghan",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 158,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "6ee000fc42f514e53290d8d11037f59628e7a180",
  },
  classifications: ["Storyborn", "Villain", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const yokaiProfessorCallaghan: LorcanitoCharacterCard = {
//   id: "upo",
//   name: "Yokai",
//   title: "Professor Callaghan",
//   characteristics: ["storyborn", "villain", "inventor"],
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Jennifer Park",
//   number: 158,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587973,
//   },
//   rarity: "common",
// };
//
