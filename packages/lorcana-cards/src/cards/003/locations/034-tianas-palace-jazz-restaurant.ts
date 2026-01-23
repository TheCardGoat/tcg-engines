import type { LocationCard } from "@tcg/lorcana-types";

export const tianasPalaceJazzRestaurant: LocationCard = {
  id: "1hy",
  cardType: "location",
  name: "Tiana's Palace",
  version: "Jazz Restaurant",
  fullName: "Tiana's Palace - Jazz Restaurant",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "003",
  text: "NIGHT OUT Characters can't be challenged while here.",
  cost: 3,
  moveCost: 2,
  lore: 0,
  cardNumber: 34,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c279e0883210f8f220e5fe8ac1b7f74b5404072f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const tianasPalaceJazzRestaurant: LorcanitoLocationCard = {
//   id: "sfq",
//   type: "location",
//   name: "Tiana's Palace",
//   title: "Jazz Restaurant",
//   characteristics: ["location"],
//   text: "**NIGHT OUT** Characters can't be challenged while here.",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Night Out",
//       text: "Characters can't be challenged while here.",
//       ability: {
//         type: "static",
//         ability: "effects",
//         name: "Night Out",
//         text: "Characters can't be challenged while here.",
//         effects: [
//           {
//             type: "restriction",
//             restriction: "be-challenged",
//             target: thisCharacter,
//           },
//         ],
//       },
//     }),
//   ],
//   flavour: "In New Orleans, dreams can come true.",
//   colors: ["amber"],
//   cost: 3,
//   willpower: 8,
//   lore: 1,
//   moveCost: 2,
//   illustrator: "Valerio Buonfantino",
//   number: 34,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537408,
//   },
//   rarity: "uncommon",
// };
//
