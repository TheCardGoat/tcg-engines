// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { have3orMorePuppiesInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const theColonelOldSheepdog: LorcanitoCharacterCard = {
//   Id: "xi2",
//   MissingTestCase: true,
//   Name: "The Colonel",
//   Title: "Old Sheepdog",
//   Characteristics: ["storyborn", "ally"],
//   Text: "WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
//   Type: "character",
//   Abilities: [
//     WhileConditionThisCharacterGets({
//       Name: "WE'VE GOT 'EM OUTNUMBERED",
//       Text: "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
//       Conditions: [have3orMorePuppiesInPlay],
//       Effects: [
//         {
//           Type: "attribute" as const,
//           Attribute: "strength" as const,
//           Amount: 2,
//           Modifier: "add" as const,
//           Target: thisCharacter,
//         },
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
//   Colors: ["amber"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 6,
//   Illustrator: "Mariana Moreno",
//   Number: 17,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631361,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
