// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { forEachCharYouHaveInPlay } from "@lorcanito/lorcana-engine/abilities/amounts";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverThisCharSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const brunoMadrigalSingingSeer: LorcanitoCharacterCard = {
//   Id: "ooe",
//   Name: "Bruno Madrigal",
//   Title: "Singing Seer",
//   Characteristics: ["floodborn", "ally", "madrigal"],
//   Text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)\nBRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(5, "Bruno Madrigal"),
//     WheneverThisCharSings({
//       Name: "BRIGHT FUTURE",
//       Text: "Whenever this character sings a song, you may draw a card for each character you have in play.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "draw",
//           Amount: forEachCharYouHaveInPlay,
//           Target: self,
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amber", "amethyst"],
//   Cost: 7,
//   Strength: 3,
//   Willpower: 7,
//   Illustrator: "Milica Celikovic",
//   Number: 20,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631364,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
