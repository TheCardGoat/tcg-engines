import type { LocationCard } from "@tcg/lorcana-types";

export const tropicalRainforestJaguarLair: LocationCard = {
  id: "n0b",
  cardType: "location",
  name: "Tropical Rainforest",
  version: "Jaguar Lair",
  fullName: "Tropical Rainforest - Jaguar Lair",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "SNACK TIME Opposing damaged characters gain Reckless. (They can't quest and must challenge if able.)",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 102,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "52ec9a7c34475277f634f704e9058f3740be19fe",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const tropicalRainforestJaguarLair: LorcanitoLocationCard = {
//   id: "voi",
//   missingTestCase: true,
//   name: "Tropical Rainforest",
//   title: "Jaguar Lair",
//   characteristics: ["location"],
//   text: "**SNACK TIME** Opposing damaged characters gain **Reckless**. _(They can’t quest and must challenge if able.)_",
//   type: "location",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Snack Time",
//       text: "Opposing damaged characters gain **Reckless**. _(They can’t quest and must challenge if able.)_",
//       gainedAbility: recklessAbility,
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "opponent" },
//           {
//             filter: "status",
//             value: "damage",
//             comparison: { operator: "gte", value: 1 },
//           },
//         ],
//       },
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Andreas Rocha",
//   number: 102,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560240,
//   },
//   rarity: "uncommon",
//   moveCost: 1,
// };
//
