// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenLocationOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// Import {
//   MoveToLocation,
//   UntilTheEndOfYourNextTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const theGamesAfoot: LorcanitoActionCard = {
//   Id: "iga",
//   Name: "The Game's Afoot!",
//   Characteristics: ["action"],
//   Text: "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Illustrator: "Kevin Slawinski",
//   Number: 198,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 660361,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     {
//       Type: "resolution",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         MoveToLocation({
//           Type: "card",
//           Value: 2,
//           UpTo: true,
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//         }),
//         UntilTheEndOfYourNextTurn({
//           Type: "ability",
//           Ability: "resist",
//           Amount: 2,
//           Modifier: "add",
//           Target: chosenLocationOfYours,
//         }),
//       ],
//     },
//   ],
// };
//
