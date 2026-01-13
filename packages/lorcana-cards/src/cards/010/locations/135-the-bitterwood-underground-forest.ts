import type { LocationCard } from "@tcg/lorcana-types";

export const theBitterwoodUndergroundForest: LocationCard = {
  id: "g5d",
  cardType: "location",
  name: "The Bitterwood",
  version: "Underground Forest",
  fullName: "The Bitterwood - Underground Forest",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "010",
  text: "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
  cost: 4,
  moveCost: 2,
  lore: 0,
  cardNumber: 135,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a3459cd9d25b260d30643f438ea1fc29b17f5b4",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { whenYouMoveACharacterHere } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theBitterwoodUndergroundForest: LorcanitoLocationCard = {
//   id: "c32",
//   name: "The Bitterwood",
//   title: "Underground Forest",
//   characteristics: ["location"],
//   text: "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
//   type: "location",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   willpower: 7,
//   illustrator: "Maximillien Borie",
//   number: 135,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658882,
//   },
//   rarity: "rare",
//   abilities: [
//     whenYouMoveACharacterHere({
//       name: "GATHER RESOURCES",
//       text: "Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
//       optional: true,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           {
//             filter: "attribute",
//             value: "strength",
//             comparison: { operator: "gte", value: 5 },
//           },
//         ],
//       },
//       conditions: [
//         { type: "first-time-move-to-location" },
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       effects: [drawACard],
//     }),
//   ],
//   moveCost: 2,
//   lore: 1,
// };
//
