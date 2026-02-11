// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mirabelMadrigalCuriousChild: LorcanitoCharacterCard = {
//   Id: "frn",
//   Name: "Mirabel Madrigal",
//   Title: "Curious Child",
//   Characteristics: ["storyborn", "hero", "madrigal"],
//   Text: "YOU ARE A JEWEL When you play this character, you may reveal a song card in your hand to gain 1 lore.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "YOU ARE A JEWEL",
//       Text: "When you play this character, you may reveal a song card in your hand to gain 1 lore.",
//       Optional: true,
//       DependentEffects: true,
//       Effects: [
//         {
//           Type: "reveal",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "action" },
//               { filter: "zone", value: "hand" },
//               { filter: "characteristics", value: ["song"] },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         YouGainLore(1),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 1,
//   Strength: 0,
//   Willpower: 2,
//   Illustrator: "Arianna Rea",
//   Number: 10,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631354,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
