// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Import { wheneverYouPlayACharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const ladyDecisiveDog: LorcanitoCharacterCard = {
//   Id: "ed3",
//   Name: "Lady",
//   Title: "Decisive Dog",
//   Characteristics: ["storyborn", "hero"],
//   Text: "PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.\nTAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}.",
//   Type: "character",
//   Abilities: [
//     WheneverYouPlayACharacter({
//       Name: "PACK OF HER OWN",
//       Text: "Whenever you play a character, this character gets +1 {S} this turn.",
//       Effects: [thisCharacterGetsStrength(1)],
//     }),
//     WhileConditionThisCharacterGets({
//       Name: "TAKE THE LEAD",
//       Text: "While this character has 3 {S} or more, she gets +2 {L}.",
//       Conditions: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Comparison: { operator: "gte", value: 3 },
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
//   Colors: ["amber", "emerald"],
//   Cost: 1,
//   Strength: 0,
//   Willpower: 3,
//   Illustrator: "Therese Vildefall",
//   Number: 33,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631373,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
