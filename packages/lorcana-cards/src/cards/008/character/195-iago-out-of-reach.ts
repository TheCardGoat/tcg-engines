// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const iagoOutOfReach: LorcanitoCharacterCard = {
//   Id: "z25",
//   Name: "Iago",
//   Title: "Out of Reach",
//   Characteristics: ["storyborn", "ally"],
//   Text: "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.",
//   Type: "character",
//   Abilities: [
//     WhileConditionThisCharacterGets({
//       Name: "Self-Preservation",
//       Text: "While you have another exerted character in play, this character can't be challenged.",
//       Conditions: [
//         {
//           Type: "filter",
//           Filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             { filter: "status", value: "exerted" },
//           ],
//           Comparison: { operator: "gte", value: 1 },
//           ExcludeSelf: true,
//         },
//       ],
//       Effects: [
//         {
//           Type: "restriction" as const,
//           Restriction: "be-challenged" as const,
//           Target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Carlos Luzzi",
//   Number: 195,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631480,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
