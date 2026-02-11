// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   EvasiveAbility,
//   Type StaticAbilityWithEffect,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whileYouHaveTwoOrMoreCharactersExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const recklessRun: StaticAbilityWithEffect = {
//   Type: "static",
//   Ability: "effects",
//   Name: "RECKLESS RUN",
//   Text: "While you have 2 or more characters exerted, this character gets +2 {S} and Evasive.",
//   Conditions: [whileYouHaveTwoOrMoreCharactersExerted],
//   Effects: [thisCharacterGetsStrength(2)],
// };
//
// Export const theCoachmanGreedyDeceiver: LorcanitoCharacterCard = {
//   Id: "q0h",
//   Name: "The Coachman",
//   Title: "Greedy Deceiver",
//   Characteristics: ["storyborn", "villain"],
//   Text: "RECKLESS RUN While you have 2 or more characters exerted, this character gets +2 {S} and Evasive. (Only characters with Evasive can challenge this character.)",
//   Type: "character",
//   Abilities: [
//     RecklessRun,
//     {
//       ...evasiveAbility,
//       Conditions: [whileYouHaveTwoOrMoreCharactersExerted],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["ruby", "steel"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Illustrator: "Filipe Lourentino",
//   Number: 140,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631441,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
