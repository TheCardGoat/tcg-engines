// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const crikeePartOfTheTeam: LorcanitoCharacterCard = {
//   Id: "pul",
//   Name: "Cri-kee",
//   Title: "Part of the Team",
//   Characteristics: ["storyborn", "ally"],
//   Text: "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
//   Type: "character",
//   Abilities: [
//     WhileConditionThisCharacterGets({
//       Name: "AT HER SIDE",
//       Text: "While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
//       Conditions: [
//         {
//           Type: "filter",
//           Filters: [
//             { filter: "status", value: "exerted" },
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//           ],
//           Comparison: { operator: "gte", value: 2 },
//           ExcludeSelf: true,
//         },
//       ],
//       Effects: [
//         {
//           Type: "attribute" as const,
//           Attribute: "lore" as const,
//           Amount: 2,
//           Modifier: "add" as const,
//           Target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 4,
//   Strength: 4,
//   Willpower: 3,
//   Illustrator: "Yu Nguyen",
//   Number: 131,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631436,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
