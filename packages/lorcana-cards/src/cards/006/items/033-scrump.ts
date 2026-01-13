import type { ItemCard } from "@tcg/lorcana-types";

export const scrump: ItemCard = {
  id: "88v",
  cardType: "item",
  name: "Scrump",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
  cost: 2,
  cardNumber: 33,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1db87a0f3feb2b0a4a3818b87f46013e9c354cd8",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { iMadeHer } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const scrump: LorcanitoItemCard = {
//   id: "jwu",
//   missingTestCase: true,
//   name: "Scrump",
//   characteristics: [],
//   text: "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
//   type: "item",
//   abilities: [iMadeHer],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Kipik",
//   number: 33,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592003,
//   },
//   rarity: "uncommon",
// };
//
