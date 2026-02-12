// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const stoppedChaosInItsTracks: LorcanitoActionCard = {
//   Id: "cm3",
//   Name: "Stopped Chaos In Its Tracks",
//   Characteristics: ["action", "song"],
//   Text: "Sing Together 8\nReturn up to 2 chosen characters with 3 {S} or less each to their player's hand.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 8,
//   Illustrator: "Edu Francisco",
//   Number: 115,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631424,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     SingerTogetherAbility(8),
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 2,
//             UpTo: true,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "attribute",
//                 Value: "strength",
//                 Comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
