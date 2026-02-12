// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// Export const dellasMoonLullaby: LorcanitoActionCard = {
//   Id: "pql",
//   Name: "Della's Moon Lullaby",
//   Characteristics: ["action", "song"],
//   Text: "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 2,
//   Illustrator: "Beatrice Blue / Otto Paredes",
//   Number: 28,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 658444,
//   },
//   Rarity: "common",
//   Abilities: [
//     {
//       Type: "resolution",
//       ResolveEffectsIndividually: false,
//       DependentEffects: false,
//       Text: "Chosen opposing character gets -2 until the start of your next turn. Draw a card.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "subtract",
//           Duration: "next_turn",
//           Until: true,
//           Target: chosenOpposingCharacter,
//         },
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     },
//   ],
// };
//
