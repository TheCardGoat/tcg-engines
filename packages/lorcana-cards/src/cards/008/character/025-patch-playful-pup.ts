// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const patchPlayfulPup: LorcanitoCharacterCard = {
//   Id: "pl4",
//   Name: "Patch",
//   Title: "Playful Pup",
//   Characteristics: ["storyborn", "puppy"],
//   Text: "Ward\nPUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.",
//   Type: "character",
//   Abilities: [
//     WardAbility,
//     WhileConditionThisCharacterGets({
//       Name: "PUPPY BARKING",
//       Text: "While you have another Puppy character in play, this character gets +1 {L}.",
//       Conditions: [
//         {
//           Type: "filter",
//           Filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//             { filter: "characteristics", value: ["puppy"] },
//           ],
//           ExcludeSelf: true,
//           Comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       Effects: [
//         {
//           Type: "attribute" as const,
//           Attribute: "lore" as const,
//           Amount: 1,
//           Modifier: "add" as const,
//           Target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amber", "sapphire"],
//   Cost: 1,
//   Strength: 0,
//   Willpower: 2,
//   Illustrator: "Oggy Christiansson",
//   Number: 25,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631368,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
