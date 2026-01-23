import type { ItemCard } from "@tcg/lorcana-types";

export const longboat: ItemCard = {
  id: "1wi",
  cardType: "item",
  name: "Longboat",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "006",
  text: "TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 2,
  cardNumber: 132,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f693d84734a618efa3cb5486f95d6154fcc2bc3d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { takeItForASpin } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const longboat: LorcanitoItemCard = {
//   id: "gci",
//   name: "Longboat",
//   characteristics: ["item"],
//   text: "TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
//   type: "item",
//   abilities: [takeItForASpin],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 0,
//   illustrator: "Alex Shin",
//   number: 132,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592009,
//   },
//   rarity: "uncommon",
// };
//
