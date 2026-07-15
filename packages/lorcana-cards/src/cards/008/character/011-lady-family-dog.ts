// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const ladyFamilyDog: LorcanitoCharacterCard = {
//   Id: "aif",
//   Name: "Lady",
//   Title: "Family Dog",
//   Characteristics: ["storyborn", "hero"],
//   Text: "SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 2,
//   Illustrator: "Erika Wiseman",
//   Number: 11,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631355,
//   },
//   Rarity: "rare",
//   Lore: 2,
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "SOMEONE TO CARE FOR",
//       Text: "When you play this character, you may play a character with cost 2 or less for free.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "play",
//           ForFree: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 IgnoreBonuses: true,
//                 Comparison: {
//                   Operator: "lte",
//                   Value: 2,
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
