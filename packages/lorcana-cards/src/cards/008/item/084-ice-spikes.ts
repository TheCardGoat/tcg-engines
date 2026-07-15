// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const iceSpikes: LorcanitoItemCard = {
//   Id: "jvt",
//   MissingTestCase: true,
//   Name: "Ice Spikes",
//   Characteristics: ["item"],
//   Text: "HOLD STILL When you play this item, exert chosen opposing character.\nIT'S STUCK {E}, 1 {I} – Exert chosen opposing item. It can't ready at the start of its next turn.",
//   Type: "item",
//   Inkwell: true,
//   Colors: ["amethyst", "sapphire"],
//   Cost: 2,
//   Illustrator: "Priya Kakati",
//   Number: 84,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631405,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "HOLD STILL",
//       Text: "When you play this item, exert chosen opposing character.",
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: chosenOpposingCharacter,
//         },
//       ],
//     },
//     {
//       Type: "activated",
//       Name: "IT'S STUCK",
//       Text: "{E}, 1 {I} – Exert chosen opposing item. It can't ready at the start of its next turn.",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//         {
//           Type: "restriction",
//           Restriction: "ready-at-start-of-turn",
//           Duration: "next_turn",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
