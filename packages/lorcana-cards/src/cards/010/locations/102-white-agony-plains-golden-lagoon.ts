import type { LocationCard } from "@tcg/lorcana-types";

export const whiteAgonyPlainsGoldenLagoon: LocationCard = {
  id: "r72",
  cardType: "location",
  name: "White Agony Plains",
  version: "Golden Lagoon",
  fullName: "White Agony Plains - Golden Lagoon",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "PURE LIQUID GOLD This location gets +1 {L} for each character here.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 102,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6204aa5feff9c42e7474c9a3e3e566653401ad50",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const whiteAgonyPlainsGoldenLagoon: LorcanitoLocationCard = {
//   id: "bkm",
//   name: "White Agony Plains",
//   title: "Golden Lagoon",
//   characteristics: ["location"],
//   text: "PURE LIQUID GOLD This location gets +1 {L} for each character here.",
//   type: "location",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Pure Liquid Gold",
//       text: "This location gets +1 {L} for each character here.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: {
//             dynamic: true,
//             sourceAttribute: "chars-at-location",
//           },
//           modifier: "add",
//           duration: "static",
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   willpower: 7,
//   illustrator: "Maximillien Borie",
//   number: 102,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660040,
//   },
//   rarity: "rare",
//   moveCost: 1,
//   lore: 0,
// };
//
