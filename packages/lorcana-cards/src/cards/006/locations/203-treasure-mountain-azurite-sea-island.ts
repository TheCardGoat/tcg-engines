import type { LocationCard } from "@tcg/lorcana-types";

export const treasureMountainAzuriteSeaIsland: LocationCard = {
  id: "19g",
  cardType: "location",
  name: "Treasure Mountain",
  version: "Azurite Sea Island",
  fullName: "Treasure Mountain - Azurite Sea Island",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
  cost: 5,
  moveCost: 2,
  lore: 0,
  cardNumber: 203,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a416a2ed276dca00b412fc5313190730b363eef2",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/targets";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const treasureMountainAzuriteSeaIsland: LorcanitoLocationCard = {
//   id: "nmj",
//   name: "Treasure Mountain",
//   title: "Azurite Sea Island",
//   characteristics: ["location"],
//   text: "SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
//   type: "location",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "Secret Weapon",
//       text: "At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
//       effects: [
//         dealDamageEffect(
//           {
//             dynamic: true,
//             sourceAttribute: "chars-at-location",
//           },
//           chosenCharacterOrLocation,
//         ),
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 5,
//   lore: 2,
//   willpower: 9,
//   illustrator: "Sam Nielson",
//   number: 203,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593047,
//   },
//   rarity: "rare",
//   moveCost: 2,
// };
//
