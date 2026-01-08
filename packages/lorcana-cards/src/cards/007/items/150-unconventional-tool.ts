import type { ItemCard } from "@tcg/lorcana-types";

export const unconventionalTool: ItemCard = {
  id: "qyw",
  cardType: "item",
  name: "Unconventional Tool",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.",
  cost: 1,
  cardNumber: 150,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6132d37f5c0ee1b84d2dc393df229f24f13c9cc6",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { unconventionalToolAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const unconventionalTool: LorcanitoItemCard = {
//   id: "xla",
//   name: "Unconventional Tool",
//   characteristics: ["item"],
//   text: "FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.",
//   type: "item",
//   abilities: [unconventionalToolAbility],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Levi Rogers",
//   number: 150,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618709,
//   },
//   rarity: "common",
// };
//
