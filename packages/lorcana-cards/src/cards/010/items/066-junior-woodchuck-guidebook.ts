import type { ItemCard } from "@tcg/lorcana-types";

export const juniorWoodchuckGuidebook: ItemCard = {
  id: "ebe",
  cardType: "item",
  name: "Junior Woodchuck Guidebook",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  externalIds: {
    ravensburger: "339967997c7a01daf66e8ad1ea06a87e9950b162",
  },
  abilities: [
    {
      id: "ebe-1",
      type: "activated",
      cost: {},
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const juniorWoodchuckGuidebook: LorcanitoItemCard = {
//   id: "qu0",
//   name: "Junior Woodchuck Guidebook",
//   characteristics: ["item"],
//   text: "THE BOOK KNOWS EVERYTHING , 1 , Banish this item — Draw 2 cards.",
//   type: "item",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Francesca Risoldi",
//   number: 66,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659448,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "activated",
//       name: "The Book Knows Everything",
//       text: "{E}, 1 {I}, Banish this item — Draw 2 cards.",
//       costs: [
//         { type: "ink", amount: 1 },
//         { type: "banish" },
//         { type: "exert" },
//       ],
//       effects: [drawXCards(2)],
//     },
//   ],
// };
//
