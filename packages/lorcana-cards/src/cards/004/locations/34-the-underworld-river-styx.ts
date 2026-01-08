// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { wheneverACharacterQuestsWhileHere } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const theUnderworldRiverStyx: LorcanitoLocationCard = {
//   id: "ez0",
//   missingTestCase: true,
//   name: "The Underworld",
//   title: "River Styx",
//   characteristics: ["location"],
//   text: "**SAVE A SOUL** Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
//   type: "location",
//   abilities: [
//     wheneverACharacterQuestsWhileHere({
//       name: "Save a Soul",
//       text: "Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
//       optional: true,
//       costs: [{ type: "ink", amount: 3 }],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   moveCost: 2,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Jeremy Adams",
//   number: 34,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550564,
//   },
//   rarity: "rare",
// };
//
