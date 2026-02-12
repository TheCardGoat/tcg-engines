// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { eachOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverYouPlayASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const tianaNaturalTalent: LorcanitoCharacterCard = {
//   Id: "ke9",
//   Name: "Tiana",
//   Title: "Natural Talent",
//   Characteristics: ["storyborn", "hero", "princess"],
//   Text: "Singer 6 (This character counts as cost 6 to sing songs.)\nCAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
//   Type: "character",
//   Abilities: [
//     SingerAbility(6),
//     WheneverYouPlayASong({
//       Name: "CAPTIVATING MELODY",
//       Text: "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 1,
//           Modifier: "subtract",
//           Duration: "next_turn",
//           Until: true,
//           Target: eachOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 4,
//   Illustrator: "Milica Cetkovic",
//   Number: 9,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631333,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
