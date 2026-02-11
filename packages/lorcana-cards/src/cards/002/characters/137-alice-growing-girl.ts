// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const aliceGrowingGirl: LorcanitoCharacterCard = {
//   Id: "wfi",
//   Reprints: ["rtw"],
//
//   Name: "Alice",
//   Title: "Growing Girl",
//   Characteristics: ["hero", "dreamborn"],
//   Text: "**GOOD ADVICE** Your other characters gain **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_\n\n**WHAT DID I DO?** While this character has 10 {S} or more, she gets +4 {L}.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "Good Advice",
//       Text: "Your other characters gain **Support**.",
//       GainedAbility: supportAbility,
//       Target: yourOtherCharacters,
//     },
//     WhileConditionThisCharacterGets({
//       Name: "What did I Do?",
//       Text: "While this character has 10 {S} or more, she gets +4 {L}.",
//       Attribute: "lore",
//       Amount: 4,
//       Conditions: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Comparison: { operator: "gte", value: 10 },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Alice Pisoni",
//   Number: 137,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 527528,
//   },
//   Rarity: "legendary",
// };
//
