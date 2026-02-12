// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// Import { wheneverACharacterQuestsWhileHere } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const theUnderworldRiverStyx: LorcanitoLocationCard = {
//   Id: "ez0",
//   MissingTestCase: true,
//   Name: "The Underworld",
//   Title: "River Styx",
//   Characteristics: ["location"],
//   Text: "**SAVE A SOUL** Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
//   Type: "location",
//   Abilities: [
//     WheneverACharacterQuestsWhileHere({
//       Name: "Save a Soul",
//       Text: "Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
//       Optional: true,
//       Costs: [{ type: "ink", amount: 3 }],
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 2,
//   MoveCost: 2,
//   Willpower: 6,
//   Lore: 1,
//   Illustrator: "Jeremy Adams",
//   Number: 34,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550564,
//   },
//   Rarity: "rare",
// };
//
