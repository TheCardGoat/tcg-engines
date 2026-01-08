import type { ItemCard } from "@tcg/lorcana-types";

export const vitalisphere: ItemCard = {
  id: "fzw",
  cardType: "item",
  name: "Vitalisphere",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "004",
  text: "EXTRACT OF RUBY 1 {I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn. (They can challenge the turn they're played.)",
  cost: 1,
  cardNumber: 134,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "39a768502f12e152241c2e471fcc3ba9e2aaad51",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoItemCard,
// } from "@lorcanito/lorcana-engine";
//
// export const vitalisphere: LorcanitoItemCard = {
//   id: "x1o",
//   name: "Vitalisphere",
//   characteristics: ["item"],
//   text: "**EXTRACT OF RUBY** 1 {I}, Banish this item - Chosen character gains **Rush** and gets +2 {S} this turn. _(They can challenge the turn they're played.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Extract of Ruby",
//       text: "1 {I}, Banish this item - Chosen character gains **Rush** and gets +2 {S} this turn. _(They can challenge the turn they're played.)_",
//       costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "rush",
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "owner",
//                 value: "self",
//               },
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         } as AbilityEffect,
//         {
//           type: "attribute",
//           modifier: "add",
//           attribute: "strength",
//           amount: 2,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "owner",
//                 value: "self",
//               },
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Sandara Tang",
//   number: 134,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548393,
//   },
//   rarity: "common",
// };
//
