// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const motherGothelDeviousConspirator: LorcanitoCharacterCard = {
//   Id: "t58",
//   Name: "Mother Gothel",
//   Title: "Devious Conspirator",
//   Characteristics: ["storyborn", "villain", "sorcerer"],
//   Text: "SOMEONE HAS TO MAKE USE OF THIS If a character was banished this turn, this character gets +2 {S}.",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 1,
//   Strength: 2,
//   Willpower: 1,
//   Illustrator: "Malia Ewart",
//   Number: 110,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659190,
//   },
//   Rarity: "common",
//   Abilities: [
//     WhileConditionThisCharacterGets({
//       Name: "SOMEONE HAS TO MAKE USE OF THIS",
//       Text: "If a character was banished this turn, this character gets +2 {S}.",
//       Attribute: "strength",
//       Amount: 2,
//       Conditions: [
//         {
//           Type: "this-turn",
//           Value: "was-banished",
//           Target: "self",
//           Filters: [{ filter: "type", value: "character" }],
//           Comparison: { operator: "gte", value: 1 },
//         },
//       ],
//     }),
//   ],
//   Lore: 1,
// };
//
