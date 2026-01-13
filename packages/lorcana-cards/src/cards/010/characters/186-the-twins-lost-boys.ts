import type { CharacterCard } from "@tcg/lorcana-types";

export const theTwinsLostBoys: CharacterCard = {
  id: "hrd",
  cardType: "character",
  name: "The Twins",
  version: "Lost Boys",
  fullName: "The Twins - Lost Boys",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "010",
  text: "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 186,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "400229c094343bcef39dadf5d3bcb7f65dcb9db2",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const theTwinsLostBoys: LorcanitoCharacterCard = {
//   id: "vuw",
//   name: "The Twins",
//   title: "Lost Boys",
//   characteristics: ["storyborn", "ally"],
//   text: "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Hana Augustine",
//   number: 186,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659409,
//   },
//   rarity: "super_rare",
//   abilities: [
//     whenYouPlayThis({
//       optional: true,
//       name: "TWO FOR ONE",
//       text: "When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "type", value: "location" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               {
//                 filter: "zone",
//                 value: "play",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
