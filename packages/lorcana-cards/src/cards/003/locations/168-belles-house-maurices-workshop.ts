import type { LocationCard } from "@tcg/lorcana-types";

export const bellesHouseMauricesWorkshop: LocationCard = {
  id: "kt9",
  cardType: "location",
  name: "Belle's House",
  version: "Maurice's Workshop",
  fullName: "Belle's House - Maurice's Workshop",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "003",
  text: "LABORATORY If you have a character here, you pay 1 {I} less to play items.",
  cost: 1,
  moveCost: 2,
  lore: 0,
  cardNumber: 168,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4b02e8ae98da7815714d4cac86d24cb2bcc76501",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
//
// export const bellesHouseMauricesWorkshop: LorcanitoLocationCard = {
//   id: "rnn",
//   type: "location",
//   name: "Belle's House",
//   title: "Maurice's Workshop",
//   characteristics: ["location"],
//   text: "**LABORATORY** If you have a character here, you pay 1 {I} less to play items.",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "LABORATORY",
//       text: " If you have a character here, you pay 1 {I} less to play items.",
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "cost",
//           amount: 1,
//           modifier: "subtract",
//           duration: "static",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Some of the most important tools in Lorcana are crafted here.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   willpower: 6,
//   lore: 0,
//   moveCost: 2,
//   illustrator: "Alex Shin",
//   number: 168,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537173,
//   },
//   rarity: "rare",
// };
//
