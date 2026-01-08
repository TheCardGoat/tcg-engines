import type { ItemCard } from "@tcg/lorcana-types";

export const potionOfMight: ItemCard = {
  id: "6dr",
  cardType: "item",
  name: "Potion of Might",
  inkType: ["ruby"],
  franchise: "Snow White",
  set: "005",
  text: "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
  cost: 1,
  cardNumber: 132,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1700b318b54e8ea7f92fdc144a34b8f49e65ff5b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoItemCard,
//   TargetConditionalEffect,
// } from "@lorcanito/lorcana-engine";
//
// const targetConditional: TargetConditionalEffect = {
//   type: "target-conditional",
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "type", value: "character" },
//       { filter: "zone", value: "play" },
//       { filter: "characteristics", value: ["villain"] },
//     ],
//   },
//   effects: [
//     {
//       type: "attribute",
//       attribute: "strength",
//       amount: 4,
//       modifier: "add",
//       duration: "turn",
//       target: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "characteristics", value: ["villain"] },
//         ],
//       },
//     },
//   ],
//   fallback: [
//     {
//       type: "attribute",
//       attribute: "strength",
//       amount: 3,
//       modifier: "add",
//       duration: "turn",
//       target: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//     },
//   ],
// };
//
// export const potionOfMight: LorcanitoItemCard = {
//   id: "a59",
//   missingTestCase: true,
//   name: "Potion of Might",
//   characteristics: ["item"],
//   text: "**VILE CONCOCTION** 1 {I} Banish this item – Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "VILE CONCOCTION",
//       text: "1 {I} Banish this item – Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
//       costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
//       effects: [targetConditional],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Kendall Hale",
//   number: 132,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561965,
//   },
//   rarity: "common",
// };
//
