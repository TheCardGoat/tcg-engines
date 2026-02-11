// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import {
//   AllCharacters,
//   ChosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { moveAllDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const cantHoldItBackAnymore: LorcanitoActionCard = {
//   Id: "mk4",
//   Name: "Can't Hold It Back Anymore",
//   Characteristics: ["action", "song"],
//   Text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
//   Type: "action",
//   Inkwell: false,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Illustrator: "E. Meldrandi / Mario O. Gabriele",
//   Number: 62,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 658499,
//   },
//   Rarity: "rare",
//   Abilities: [
//     {
//       Type: "resolution",
//       Text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: chosenOpposingCharacter,
//         },
//         MoveAllDamageEffect({
//           To: chosenOpposingCharacter,
//           From: allCharacters,
//         }),
//       ],
//     },
//   ],
// };
//
