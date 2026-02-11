// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const geppettoSkilledCraftsman: LorcanitoCharacterCard = {
//   Id: "sp2",
//   Name: "Geppetto",
//   Title: "Skilled Craftsman",
//   Characteristics: ["storyborn", "ally", "inventor"],
//   Text: "SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
//   Type: "character",
//   Abilities: [
//     WheneverThisCharacterQuests({
//       Name: "SEEKING INSPIRATION",
//       Text: "Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 1, // PLACEHOLDER: Amount lives on target
//           Target: {
//             Type: "card",
//             Value: 99,
//             UpTo: true,
//             Filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           ForEach: [youGainLore(1)],
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Malia Ewart",
//   Number: 174,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 633102,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
