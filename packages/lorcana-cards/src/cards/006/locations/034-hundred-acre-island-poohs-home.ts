import type { LocationCard } from "@tcg/lorcana-types";

export const hundredAcreIslandPoohsHome: LocationCard = {
  id: "5uo",
  cardType: "location",
  name: "Hundred Acre Island",
  version: "Pooh's Home",
  fullName: "Hundred Acre Island - Pooh's Home",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 34,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "151793bdd22cfedc309bf2800d3835a4e0ed038c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringOpponentsTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const hundredAcreIslandPoohsHome: LorcanitoLocationCard = {
//   id: "qkp",
//   missingTestCase: true,
//   name: "Hundred Acre Island",
//   title: "Pooh's Home",
//   characteristics: ["location"],
//   text: "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Friends Forever",
//       text: "During an opponent's turn, whenever a character is banished here, gain 1 lore.",
//       conditions: [duringOpponentsTurn],
//       ability: whenThisCharacterBanished({
//         name: "Friends Forever",
//         text: "During an opponent's turn, whenever a character is banished here, gain 1 lore.",
//         effects: [
//           {
//             type: "lore",
//             amount: 1,
//             modifier: "add",
//             target: self,
//           },
//         ],
//       }),
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   willpower: 5,
//   moveCost: 1,
//   illustrator: "Andreas Rocha",
//   number: 34,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591985,
//   },
//   rarity: "common",
// };
//
