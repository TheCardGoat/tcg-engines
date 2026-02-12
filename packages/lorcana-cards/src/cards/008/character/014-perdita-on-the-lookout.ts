// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const perditaOnTheLookout: LorcanitoCharacterCard = {
//   Id: "q2j",
//   MissingTestCase: true,
//   Name: "Perdita",
//   Title: "On the Lookout",
//   Characteristics: ["storyborn", "hero"],
//   Text: "KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.",
//   Type: "character",
//   Abilities: [
//     WhileConditionThisCharacterGets({
//       Name: "KEEPING WATCH",
//       Text: "While you have a Puppy character in play, this character gets +1 {W}.",
//       Attribute: "willpower",
//       Amount: 1,
//       Conditions: [
//         {
//           Type: "filter",
//           Comparison: {
//             Operator: "gte",
//             Value: 1,
//           },
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             { filter: "characteristics", value: ["puppy"] },
//           ],
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 4,
//   Illustrator: "Carmine Pucci",
//   Number: 14,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631358,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
