import type { LocationCard } from "@tcg/lorcana-types";

export const arielsGrottoASecretPlace: LocationCard = {
  id: "1ca",
  cardType: "location",
  name: "Ariel’s Grotto",
  version: "A Secret Place",
  fullName: "Ariel’s Grotto - A Secret Place",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "TREASURE TROVE While you have 3 or more items in play, this location gets +2 {L}.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 169,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ade3b9a1cc4c9a87627a75f1318e62b804de153e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
//
// export const arielsGrottoASecretPlace: LorcanitoLocationCard = {
//   id: "ip4",
//   name: "Ariel's Grotto",
//   title: "A Secret Place",
//   characteristics: ["location"],
//   text: "**TREASURE TROVE** While you have 3 or more items in play, this location gets +2 {L}.",
//   type: "location",
//   abilities: [
//     propertyStaticAbilities({
//       name: "Treasure Trove",
//       text: "While you have 3 or more items in play, this location gets +2 {L}.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "type", value: "item" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//           comparison: {
//             operator: "gte",
//             value: 3,
//           },
//         },
//       ],
//       attribute: "lore",
//       amount: 2,
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   moveCost: 2,
//   willpower: 7,
//   illustrator: "Jeremy Adams",
//   number: 169,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549337,
//   },
//   rarity: "rare",
// };
//
