import type { ItemCard } from "@tcg/lorcana-types";

export const munchingsAndCrunchings: ItemCard = {
  id: "16w",
  cardType: "item",
  name: "Munchings and Crunchings",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "WHAT A JUICY APPLE {E} — Remove up to 2 damage from chosen character.\nCOME ON OUT You pay 1 {I} less to play characters named Gurgi.",
  cost: 2,
  cardNumber: 33,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9a9b1c40e3d11ec217057176fbb7eef45d983670",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
//
// export const munchingsAndCrunchings: LorcanitoItemCard = {
//   id: "po2",
//   name: "Munchings And Crunchings",
//   characteristics: ["item"],
//   text: "WHAT A JUICY APPLE {E} - Remove up to 2 damage from chosen character.\nCOME ON OUT You pay 1 {I} less to play characters named Gurgi.",
//   type: "item",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Marco Giorgianni",
//   number: 33,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658768,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "activated",
//       name: "What a Juicy Apple",
//       text: "{E} - Remove up to 2 damage from chosen character.",
//       optional: false,
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               {
//                 filter: "zone",
//                 value: "play",
//               },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       type: "static",
//       ability: "effects",
//       name: "Come On Out",
//       text: "You pay 1 {I} less to play characters named Gurgi.",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "while_in_play",
//           amount: 1,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "Gurgi" },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
