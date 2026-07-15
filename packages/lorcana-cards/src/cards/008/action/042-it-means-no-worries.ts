// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const itMeansNoWorries: LorcanitoActionCard = {
//   Id: "u6f",
//   Name: "It Means No Worries",
//   Characteristics: ["action", "song"],
//   Text: "Sing Together 9 (Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)\nReturn up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
//   Type: "action",
//   Inkwell: false,
//   Colors: ["amber"],
//   Cost: 9,
//   Illustrator: "Gianluca Barone",
//   Number: 42,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631380,
//   },
//   Rarity: "rare",
//   Abilities: [
//     SingerTogetherAbility(9),
//     {
//       Type: "resolution",
//       Effects: [youPayXLessToPlayNextCharThisTurn(2)],
//     },
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 3,
//             UpTo: true,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
