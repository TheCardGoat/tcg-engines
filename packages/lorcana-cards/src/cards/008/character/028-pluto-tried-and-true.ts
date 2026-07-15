// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   WhileThisCharacterHasNoDamageGains,
//   WhileThisCharacterHasNoDamageGets,
// } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const plutoAbilityNameAndText = {
//   Name: "HAPPY HELPER",
//   Text: "While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
// };
//
// Export const plutoTriedAndTrue: LorcanitoCharacterCard = {
//   Id: "fpu",
//   Name: "Pluto",
//   Title: "Tried and True",
//   Characteristics: ["storyborn", "ally"],
//   Text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
//   Type: "character",
//   Abilities: [
//     WhileThisCharacterHasNoDamageGets({
//       ...plutoAbilityNameAndText,
//       Effects: [thisCharacterGetsStrength(2)],
//     }),
//     WhileThisCharacterHasNoDamageGains({
//       ...plutoAbilityNameAndText,
//       Ability: supportAbility,
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber", "steel"],
//   Cost: 6,
//   Strength: 2,
//   Willpower: 7,
//   Illustrator: "Raquel Villanueva",
//   Number: 28,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631370,
//   },
//   Rarity: "uncommon",
//   Lore: 2,
// };
//
