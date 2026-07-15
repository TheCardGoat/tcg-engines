// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverYouPlayASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const arielSonicWarrior: LorcanitoCharacterCard = {
//   Id: "v5n",
//   Reprints: ["hbk"],
//   MissingTestCase: true,
//   Name: "Ariel",
//   Title: "Sonic Warrior",
//   Characteristics: ["hero", "floodborn", "princess"],
//   Text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Ariel.)_\n<br>\n**AMPLIFIED VOICE** Whenever you play a song, you may pay {I} to deal 3 daamge to chosen character.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(4, "Ariel"),
//     WheneverYouPlayASong({
//       Name: "**AMPLIFIED VOICE**",
//       Text: "Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
//       Optional: true,
//       Costs: [{ type: "ink", amount: 2 }],
//       Effects: [dealDamageEffect(3, chosenCharacter)],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 8,
//   Lore: 2,
//   Illustrator: "Marcel Berg",
//   Number: 175,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 543908,
//   },
//   Rarity: "super_rare",
// };
//
