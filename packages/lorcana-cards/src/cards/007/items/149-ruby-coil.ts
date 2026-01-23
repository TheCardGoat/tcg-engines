import type { ItemCard } from "@tcg/lorcana-types";

export const rubyCoil: ItemCard = {
  id: "1mn",
  cardType: "item",
  name: "Ruby Coil",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "007",
  text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
  cost: 2,
  cardNumber: 149,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d250ec35251eedb4e3d598f75f217e0acca62570",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { rubyCoilAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const rubyCoil: LorcanitoItemCard = {
//   id: "y74",
//   name: "Ruby Coil",
//   characteristics: ["item"],
//   text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
//   type: "item",
//   abilities: [rubyCoilAbility],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Francesco Colucci",
//   number: 149,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619492,
//   },
//   rarity: "uncommon",
// };
//
