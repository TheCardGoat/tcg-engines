import type { ItemCard } from "@tcg/lorcana-types";

export const amberCoil: ItemCard = {
  id: "7an",
  cardType: "item",
  name: "Amber Coil",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "007",
  text: "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
  cost: 1,
  cardNumber: 41,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1a4b8495891072543683523882d11f76e3883842",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { amberCoilAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const amberCoil: LorcanitoItemCard = {
//   id: "e7x",
//   name: "Amber Coil",
//   characteristics: ["item"],
//   text: "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
//   type: "item",
//   abilities: [amberCoilAbility],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Francesco Colucci",
//   number: 41,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619430,
//   },
//   rarity: "uncommon",
// };
//
