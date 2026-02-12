// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const brutusFearsomeCrocodile: LorcanitoCharacterCard = {
//   Id: "xuo",
//   Name: "Brutus",
//   Title: "Fearsome Crocodile",
//   Characteristics: ["storyborn", "ally"],
//   Text: "SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
//   Type: "character",
//   Abilities: [
//     WhenThisCharacterBanished({
//       Name: "SPITEFUL",
//       Text: "During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
//       Conditions: [
//         {
//           Type: "during-turn",
//           Value: "self",
//         },
//         {
//           Type: "this-turn",
//           Value: "was-damaged",
//           Target: "self",
//           Comparison: { operator: "gte", value: 1 },
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//           ],
//         },
//       ],
//       Effects: [youGainLore(2)],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 4,
//   Strength: 4,
//   Willpower: 3,
//   Illustrator: "Teresita OJ / SOG",
//   Number: 125,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 633431,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
