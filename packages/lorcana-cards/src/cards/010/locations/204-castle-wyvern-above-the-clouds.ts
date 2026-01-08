import type { LocationCard } from "@tcg/lorcana-types";

export const castleWyvernAboveTheClouds: LocationCard = {
  id: "hqg",
  cardType: "location",
  name: "Castle Wyvern",
  version: "Above the Clouds",
  fullName: "Castle Wyvern - Above the Clouds",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here. (They get +1 {S} while challenging. Damage dealt to them is reduced by 1.)",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 204,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3feacecee6585dbc2d6c700e8829954a5add3131",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import {
//   challengerAbility,
//   gainAbilityWhileHere,
//   resistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const castleWyvernAboveTheClouds: LorcanitoLocationCard = {
//   id: "wki",
//   name: "Castle Wyvern",
//   title: "Above the Clouds",
//   characteristics: ["location"],
//   text: "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "PROTECT THIS CASTLE",
//       text: "Characters gain **Challenger** +1  while here.",
//       ability: challengerAbility(1),
//     }),
//     gainAbilityWhileHere({
//       name: "PROTECT THIS CASTLE",
//       text: "Characters gain **Resist** +1 while here.",
//       ability: resistAbility(1),
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   willpower: 5,
//   illustrator: "Etienne Savoie",
//   number: 204,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659594,
//   },
//   rarity: "rare",
//   moveCost: 1,
//   lore: 1,
// };
//
