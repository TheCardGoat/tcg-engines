// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const goldenHarpEnchanterOfTheLand: LorcanitoCharacterCard = {
//   Id: "ph6",
//   Name: "Golden Harp",
//   Title: "Enchanter of the Land",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**STOLEN AWAY** At the end of your turn, if you didn't play a song this turn, banish this character.",
//   Type: "character",
//   Abilities: [
//     AtTheEndOfYourTurn({
//       Name: "**STOLEN AWAY**",
//       Text: "At the end of your turn, if you didn't play a song this turn, banish this character.",
//       Effects: [
//         {
//           Type: "banish",
//           Target: thisCharacter,
//         },
//       ],
//       Conditions: [
//         {
//           Type: "played-songs",
//           Value: false,
//         },
//       ],
//     }),
//   ],
//   Flavour: "You'll miss her when she's gone.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 1,
//   Strength: 1,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Andrea Parisi",
//   Number: 11,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549623,
//   },
//   Rarity: "rare",
// };
//
