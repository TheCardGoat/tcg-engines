// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const lieutenantMattias: LorcanitoCharacterCard = {
//   Id: "lma",
//   Name: "Lieutenant Mattias",
//   Title: "Strict Teacher",
//   Characteristics: ["storyborn", "ally", "knight"],
//   Text: "TRAINING EXERCISES Ready all your characters. They gain Reckless until end of turn.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "TRAINING EXERCISES",
//       Text: "Ready all your characters. They gain Reckless until end of turn.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "exert",
//           Exert: false,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         {
//           Type: "ability",
//           Ability: "reckless",
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Inkwell: false,
//   Colors: ["ruby"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Daniel Williams",
//   Number: 146,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 618154,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
