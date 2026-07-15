// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   MoveDamageAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   ChosenCharacter,
//   ChosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const belleAccomplishedMystic: LorcanitoCharacterCard = {
//   Id: "j8p",
//   Reprints: ["cqp"],
//   MissingTestCase: true,
//   Name: "Belle",
//   Title: "Accomplished Mystic",
//   Characteristics: ["hero", "floodborn", "sorcerer", "princess"],
//   Text: "**Shift** 3\n\n\n**ENHANCED HEALING** When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(3, "belle"),
//     WhenYouPlayThis({
//       Name: "ENHANCED HEALING",
//       Text: "When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
//       Optional: true,
//       ...moveDamageAbility({
//         Amount: 3,
//         UpTo: true,
//         From: chosenCharacter,
//         To: chosenOpposingCharacter,
//       }),
//     }),
//   ],
//   Flavour: "The mixed ink had changed more than just the rose.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Malia Ewart",
//   Number: 36,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549294,
//   },
//   Rarity: "super_rare",
// };
//
