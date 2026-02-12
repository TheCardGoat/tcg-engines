// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const kuzcoBoredRoyal: LorcanitoCharacterCard = {
//   Id: "bk2",
//   Name: "Kuzco",
//   Title: "Bored Royal",
//   Characteristics: ["storyborn", "king"],
//   Text: "LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 1,
//   Willpower: 3,
//   Illustrator: "Rachel Elese",
//   Number: 53,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631387,
//   },
//   Rarity: "common",
//   Lore: 1,
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "LLAMA BREATH",
//       Text: "When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "type",
//                 Value: ["character", "item", "location"],
//               },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 Comparison: {
//                   Operator: "lte",
//                   Value: 2,
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
