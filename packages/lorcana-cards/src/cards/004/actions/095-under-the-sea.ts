// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const underTheSea: LorcanitoActionCard = {
//   Id: "s4i",
//   Reprints: ["wlg"],
//   Name: "Under The Sea",
//   Characteristics: ["action", "song"],
//   Text: "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
//   Type: "action",
//   Abilities: [
//     SingerTogetherAbility(8),
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "move",
//           To: "deck",
//           Bottom: true,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               {
//                 Filter: "attribute",
//                 Value: "strength",
//                 Comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "Such wonderful things surround you",
//   Colors: ["emerald"],
//   Cost: 8,
//   Illustrator: "Dylan Bonner",
//   Number: 95,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547844,
//   },
//   Rarity: "rare",
// };
//
