import type { LocationCard } from "@tcg/lorcana-types";

export const ursulasGardenFullOfTheUnfortunate: LocationCard = {
  id: "1h6",
  cardType: "location",
  name: "Ursula’s Garden",
  version: "Full of the Unfortunate",
  fullName: "Ursula’s Garden - Full of the Unfortunate",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "004",
  text: "ABANDON HOPE While you have an exerted character here, opposing characters get -1 {L}.",
  cost: 4,
  moveCost: 2,
  lore: 0,
  cardNumber: 102,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bfdd7ccd7b6612d9bacfba22591df0987519db23",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { allOpposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const ursulasGardenFullOfTheUnfortunate: LorcanitoLocationCard = {
//   id: "bh5",
//   name: "Ursula's Garden",
//   title: "Full of the Unfortunate",
//   characteristics: ["location"],
//   text: "**Abandon Hope** While you have an exerted character here, opposing characters get -1 {L}.",
//   type: "location",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Abandon Hope",
//       text: "While you have an exerted character here, opposing characters get -1 {L}.",
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             {
//               filter: "status",
//               value: "exerted",
//             },
//           ],
//         },
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "subtract",
//           duration: "static",
//           target: allOpposingCharacters,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   moveCost: 2,
//   willpower: 7,
//   lore: 1,
//   illustrator: "Jonathan Livslyst",
//   number: 102,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547688,
//   },
//   rarity: "rare",
// };
//
