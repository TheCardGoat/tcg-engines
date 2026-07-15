// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   ResistAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const rhinoPowerHamster: LorcanitoCharacterCard = {
//   Id: "x98",
//   Name: "Rhino",
//   Title: "Power Hamster",
//   Characteristics: ["floodborn", "ally"],
//   Text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Rhino.)\nEPIC BALL OF AWESOME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(2, "Rhino"),
//     WhileConditionThisCharacterGains({
//       Name: "EPIC BALL OF AWESOME",
//       Text: "While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
//       Ability: resistAbility(2),
//       Conditions: [
//         {
//           Type: "damage",
//           Comparison: { operator: "eq", value: 0 },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber", "steel"],
//   Cost: 4,
//   Strength: 4,
//   Willpower: 3,
//   Illustrator: "Leonardo Giammichele",
//   Number: 30,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631700,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
