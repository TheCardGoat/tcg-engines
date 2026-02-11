// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const sirPellinoreSeasonedKnight: LorcanitoCharacterCard = {
//   Id: "dfp",
//   Name: "Sir Pellinore",
//   Title: "Seasoned Knight",
//   Characteristics: ["storyborn", "knight"],
//   Text: "CODE OF HONOR Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
//   Type: "character",
//   Abilities: [
//     WheneverThisCharacterQuests({
//       Name: "CODE OF HONOR",
//       Text: "Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "support",
//           Modifier: "add",
//           Duration: "turn",
//           Until: true,
//           Target: {
//             Type: "card",
//             Value: "all",
//             ExcludeSelf: true,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 4,
//   Illustrator: "Rudy Hill",
//   Number: 154,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631829,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
