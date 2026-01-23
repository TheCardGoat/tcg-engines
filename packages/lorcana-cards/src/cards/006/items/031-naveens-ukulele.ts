import type { ItemCard } from "@tcg/lorcana-types";

export const naveensUkulele: ItemCard = {
  id: "1ge",
  cardType: "item",
  name: "Naveen's Ukulele",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  text: "MAKE IT SING 1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.",
  cost: 1,
  cardNumber: 31,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd8e75a123246ef236f0a66f968470bd4463ebf3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { makeItSings } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const naveensUkulele: LorcanitoItemCard = {
//   id: "zt0",
//   missingTestCase: true,
//   name: "Naveen's Ukulele",
//   characteristics: ["item"],
//   text: "MAKE IT SING 1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.",
//   type: "item",
//   abilities: [makeItSings],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Levi Rogers",
//   number: 31,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593032,
//   },
//   rarity: "common",
// };
//
