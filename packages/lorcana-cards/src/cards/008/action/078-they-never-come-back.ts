// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const theyNeverComeBack: LorcanitoActionCard = {
//   Id: "dtw",
//   Name: "They Never Come Back",
//   Characteristics: ["action"],
//   Text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         DrawACard,
//         {
//           Type: "restriction",
//           Restriction: "ready-at-start-of-turn",
//           Duration: "next_turn",
//           Target: {
//             Type: "card",
//             Value: 2,
//             UpTo: true,
//             Filters: chosenCharacter.filters,
//           },
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 3,
//   Illustrator: "Saulo Nate",
//   Number: 78,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631694,
//   },
//   Rarity: "uncommon",
// };
//
