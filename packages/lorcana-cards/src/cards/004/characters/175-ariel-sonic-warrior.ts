// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const arielSonicWarrior: LorcanitoCharacterCard = {
//   id: "v5n",
//   reprints: ["hbk"],
//   missingTestCase: true,
//   name: "Ariel",
//   title: "Sonic Warrior",
//   characteristics: ["hero", "floodborn", "princess"],
//   text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Ariel.)_\n<br>\n**AMPLIFIED VOICE** Whenever you play a song, you may pay {I} to deal 3 daamge to chosen character.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Ariel"),
//     wheneverYouPlayASong({
//       name: "**AMPLIFIED VOICE**",
//       text: "Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
//       optional: true,
//       costs: [{ type: "ink", amount: 2 }],
//       effects: [dealDamageEffect(3, chosenCharacter)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 3,
//   willpower: 8,
//   lore: 2,
//   illustrator: "Marcel Berg",
//   number: 175,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543908,
//   },
//   rarity: "super_rare",
// };
//
