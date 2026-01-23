import type { LocationCard } from "@tcg/lorcana-types";

export const rlsLegacySolarGalleon: LocationCard = {
  id: "1ng",
  cardType: "location",
  name: "RLS Legacy",
  version: "Solar Galleon",
  fullName: "RLS Legacy - Solar Galleon",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "003",
  text: "THIS IS OUR SHIP Characters gain Evasive while here. (Only characters with Evasive can challenge them.)\nHEAVE TOGETHER NOW If you have a character here, you pay 2 {I} less to move a character of yours here.",
  cost: 4,
  moveCost: 3,
  lore: 0,
  cardNumber: 136,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d4aef0fcfa1c528b3a1c3a7a33b1a84160fb6748",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   gainAbilityWhileHere,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
//
// export const rlsLegacySolarGalleon: LorcanitoLocationCard = {
//   id: "ok0",
//   type: "location",
//   name: "RLS Legacy",
//   title: "Solar Galleon",
//   characteristics: ["location"],
//   text: "**THIS IS OUR SHIP** Characters gain **Evasive** while here. _(Only characters with Evasive can challenge them.)_\n\n\n**HEAVE TOGETHER NOW** If you have a character here, you pay 2 {I} less to move a character of yours here.",
//   abilities: [
//     propertyStaticAbilities({
//       name: "HEAVE TOGETHER NOW",
//       text: "If you have a character here, you pay 2 {I} less to move a character of yours here.",
//       attribute: "moveCost",
//       amount: 2,
//       modifier: "subtract",
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//     }),
//     gainAbilityWhileHere({
//       name: "This is Our Ship",
//       text: "Characters gain **Evasive** while here. _(Only characters with Evasive can challenge them.)_",
//       ability: evasiveAbility,
//     }),
//   ],
//   colors: ["ruby"],
//   cost: 4,
//   willpower: 8,
//   moveCost: 3,
//   lore: 2,
//   illustrator: "Wietse Treurniet",
//   number: 136,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538682,
//   },
//   rarity: "rare",
// };
//
