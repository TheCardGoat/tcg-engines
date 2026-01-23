// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   whileThisCharacterHasNoDamageGains,
//   whileThisCharacterHasNoDamageGets,
// } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// const plutoAbilityNameAndText = {
//   name: "HAPPY HELPER",
//   text: "While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
// };
//
// export const plutoTriedAndTrue: LorcanitoCharacterCard = {
//   id: "fpu",
//   name: "Pluto",
//   title: "Tried and True",
//   characteristics: ["storyborn", "ally"],
//   text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
//   type: "character",
//   abilities: [
//     whileThisCharacterHasNoDamageGets({
//       ...plutoAbilityNameAndText,
//       effects: [thisCharacterGetsStrength(2)],
//     }),
//     whileThisCharacterHasNoDamageGains({
//       ...plutoAbilityNameAndText,
//       ability: supportAbility,
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber", "steel"],
//   cost: 6,
//   strength: 2,
//   willpower: 7,
//   illustrator: "Raquel Villanueva",
//   number: 28,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631370,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
