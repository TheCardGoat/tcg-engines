import type { ItemCard } from "@tcg/lorcana-types";

export const poohPirateShip: ItemCard = {
  id: "6g9",
  cardType: "item",
  name: "Pooh Pirate Ship",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.",
  cost: 1,
  cardNumber: 32,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1740993c2d9c41b47477e050c6664ad461d7aa89",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { makeARescue } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const poohPirateShip: LorcanitoItemCard = {
//   id: "snl",
//   missingTestCase: true,
//   name: "Pooh Pirate Ship",
//   characteristics: ["item"],
//   text: "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.",
//   type: "item",
//   abilities: [makeARescue],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Kaitlin Cuthbertson",
//   number: 32,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587239,
//   },
//   rarity: "rare",
// };
//
