// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   AllOpposingCharacters,
//   AnyNumberOfChosenCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const headsHeldHigh: LorcanitoActionCard = {
//   Id: "tfh",
//   MissingTestCase: true,
//   Name: "Heads Held High",
//   Characteristics: ["action", "song"],
//   Text: "Sing Together 6\nRemove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
//   Type: "action",
//   Abilities: [
//     SingerTogetherAbility(6),
//     {
//       Type: "resolution",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 3,
//           UpTo: true,
//           Target: anyNumberOfChosenCharacters,
//         },
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 3,
//           Modifier: "subtract",
//           Duration: "turn",
//           Until: true,
//           Target: allOpposingCharacters,
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 6,
//   Illustrator: "Lorenza Pigliamosche / Livio Cacciatore",
//   Number: 175,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631348,
//   },
//   Rarity: "rare",
// };
//
