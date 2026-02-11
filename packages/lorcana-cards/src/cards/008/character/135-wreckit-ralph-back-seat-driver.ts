// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const wreckitRalphBackSeatDriver: LorcanitoCharacterCard = {
//   Id: "nhw",
//   Name: "Wreck-it Ralph",
//   Title: "Back Seat Driver",
//   Characteristics: ["storyborn", "hero", "racer"],
//   Text: "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "CHARGED UP",
//       Text: "When you play this character, chosen Racer character gets +4 {S} this turn.",
//       Effects: [
//         GetStrengthThisTurn(4, {
//           Type: "card",
//           Value: 1,
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "characteristics", value: ["racer"] },
//           ],
//         }),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 3,
//   Strength: 4,
//   Willpower: 2,
//   Illustrator: "Joseph Buening",
//   Number: 135,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631692,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
