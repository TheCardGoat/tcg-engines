// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { putCardFromDiscardToInkwellFaceDownAndExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const rollyChubbyPuppy: LorcanitoCharacterCard = {
//   Id: "das",
//   Name: "Rolly",
//   Title: "Chubby Puppy",
//   Characteristics: ["storyborn", "puppy"],
//   Text: "Support \nADORABLE ANTICS When you play this character, you may put a character card from your discard in your inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     SupportAbility,
//     WhenYouPlayThisCharacter({
//       Name: "ADORABLE ANTICS",
//       Text: "When you play this character, you may put a character card from your discard in your inkwell facedown and exerted.",
//       Optional: true,
//       Effects: [
//         PutCardFromDiscardToInkwellFaceDownAndExerted({
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//           ],
//         }),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber", "sapphire"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 3,
//   Illustrator: "Oggy Christianson",
//   Number: 26,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631369,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
