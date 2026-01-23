import type { ItemCard } from "@tcg/lorcana-types";

export const galacticCommunicator: ItemCard = {
  id: "q1z",
  cardType: "item",
  name: "Galactic Communicator",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.",
  cost: 2,
  cardNumber: 99,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5de77ec98209b02711da467966a414e2894f860a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { resourceAllocation } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const galacticCommunicator: LorcanitoItemCard = {
//   id: "ryf",
//   missingTestCase: true,
//   name: "Galactic Communicator",
//   characteristics: ["item"],
//   text: "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.",
//   type: "item",
//   abilities: [resourceAllocation],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Jiahui Eva Gao",
//   number: 99,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588088,
//   },
//   rarity: "common",
// };
//
