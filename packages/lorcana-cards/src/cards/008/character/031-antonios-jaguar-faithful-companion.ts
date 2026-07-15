// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const antoniosJaguarFaithfulCompanion: LorcanitoCharacterCard = {
//   Id: "lsm",
//   Name: "Antonio's Jaguar",
//   Title: "Faithful Companion",
//   Characteristics: ["storyborn", "ally"],
//   Text: "YOU WANT TO GO WHERE? When you play this character, if you have a character in play named Antonio Madrigal, gain 1 lore.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "YOU WANT TO GO WHERE?",
//       Text: "When you play this character, if you have a character in play named Antonio Madrigal, gain 1 lore.",
//       Conditions: [
//         {
//           Type: "filter",
//           Comparison: { operator: "gte", value: 1 },
//           Filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             {
//               Filter: "attribute",
//               Value: "name",
//               Comparison: { operator: "eq", value: "Antonio Madrigal" },
//             },
//           ],
//         },
//       ],
//       Effects: [youGainLore(1)],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 4,
//   Illustrator: "Denny Minonne",
//   Number: 31,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631344,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
