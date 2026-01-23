import type { ItemCard } from "@tcg/lorcana-types";

export const amethystCoil: ItemCard = {
  id: "1bj",
  cardType: "item",
  name: "Amethyst Coil",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "007",
  text: "MAGICAL TOUCH During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
  cost: 3,
  cardNumber: 84,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ac754e91e28825cba2776c444e2988b47cd9016b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { amethystCoilAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const amethystCoil: LorcanitoItemCard = {
//   id: "sw5",
//   name: "Amethyst Coil",
//   characteristics: ["item"],
//   type: "item",
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Francesco Colucci",
//   number: 84,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619451,
//   },
//   rarity: "uncommon",
//   text: "MAGICAL TOUCH During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
//   abilities: [amethystCoilAbility],
// };
//
