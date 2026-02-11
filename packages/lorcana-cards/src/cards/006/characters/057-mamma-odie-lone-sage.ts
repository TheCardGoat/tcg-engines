// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenCharacter,
//   ChosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverYouPlayASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mammaOdieLoneSage: LorcanitoCharacterCard = {
//   Id: "dhe",
//   MissingTestCase: true,
//   Name: "Mama Odie",
//   Title: "Solitary Sage",
//   Characteristics: ["storyborn", "ally", "sorcerer"],
//   Text: "I HAVE TO DO EVERYTHING AROUND HERE Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//   Type: "character",
//   Abilities: [
//     WheneverYouPlayASong({
//       Name: "I Have To Do Everything Around Here",
//       Text: "Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//       Effects: [
//         MoveDamageEffect({
//           Amount: 2,
//           From: chosenCharacter,
//           To: chosenOpposingCharacter,
//         }),
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amethyst"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Mel Milton",
//   Number: 57,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 591113,
//   },
//   Rarity: "rare",
// };
//
