// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import {
//   ExertChosenItem,
//   ExertedItemCantReadyNextTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const heiheiNotsotrickyChicken: LorcanitoCharacterCard = {
//   Id: "njq",
//   MissingTestCase: true,
//   Name: "Heihei",
//   Title: "Not-So-Tricky Chicken",
//   Characteristics: ["storyborn", "ally"],
//   Text: "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.\nOUT TO LUNCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Eat Anything",
//       Text: "When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.",
//       Effects: [exertChosenItem, exertedItemCantReadyNextTurn],
//     },
//     WhileConditionThisCharacterGains({
//       Name: "Out To Lunch",
//       Text: "During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
//       Ability: evasiveAbility,
//       Conditions: [
//         {
//           Type: "during-turn",
//           Value: "self",
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Lisanne Koeteuw",
//   Number: 146,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 588363,
//   },
//   Rarity: "uncommon",
// };
//
