import type { ItemCard } from "@tcg/lorcana-types";

export const ratigansMarvelousTrap: ItemCard = {
  id: "1wo",
  cardType: "item",
  name: "Ratigan's Marvelous Trap",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "SNAP! BOOM! TWANG! Banish this item — Each opponent loses 2 lore.",
  cost: 3,
  cardNumber: 102,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7d80a26f58d881fa3db9124289c55a934cd1782",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ratigansMarvelousTrap: LorcanitoItemCard = {
//   id: "ihx",
//
//   name: "Ratigan's Marvelous Trap",
//   characteristics: ["item"],
//   text: "**SNAP! BOOM! TWANG!** Banish this item − Each opponent loses 2 lore.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Snap! Boom! Twang!",
//       text: "Banish this item − Each opponent loses 2 lore.",
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "lore",
//           amount: 2,
//           modifier: "subtract",
//           target: {
//             type: "player",
//             value: "opponent",
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Simple in purpose, elaborate in execution−just like Ratigan.",
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Leonardo Giammichele",
//   number: 102,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527245,
//   },
//   rarity: "rare",
// };
//
