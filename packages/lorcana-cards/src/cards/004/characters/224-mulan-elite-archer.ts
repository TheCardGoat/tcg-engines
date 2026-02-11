// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   ChosenCharacter,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverThisCharacterDealsDamageInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mulanEliteArcher: LorcanitoCharacterCard = {
//   Id: "nst",
//   Reprints: ["t4r"],
//   Name: "Mulan",
//   Title: "Elite Archer",
//   Characteristics: ["hero", "floodborn", "princess"],
//   Text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Mulan.)_ **STRAIGHT SHOOTER** When you play this character, if you used **Shift** to play her, she gets +3 {S} this turn. **TRIPPLE SHOT** During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(5, "Mulan"),
//     {
//       Type: "resolution",
//       Name: "Straight Shooter",
//       Text: "When you play this character, if you used **Shift** to play her, she gets +3 {S} this turn.",
//       ResolutionConditions: [{ type: "resolution", value: "shift" }],
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Duration: "turn",
//           Amount: 3,
//           Modifier: "add",
//           Target: thisCharacter,
//         },
//       ],
//     },
//     WheneverThisCharacterDealsDamageInChallenge({
//       Name: "Triple Shot",
//       Text: "During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
//       Conditions: [{ type: "during-turn", value: "self" }],
//       Effects: [
//         DealDamageEffect(
//           {
//             Dynamic: true,
//             GetAmountFromTrigger: true,
//           },
//           { ...chosenCharacter, value: 2, upTo: true },
//         ),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 6,
//   Strength: 2,
//   Willpower: 6,
//   Lore: 2,
//   Illustrator: "Nicola Saviori",
//   Number: 224,
//   Set: "URR",
//   Rarity: "legendary",
// };
//
