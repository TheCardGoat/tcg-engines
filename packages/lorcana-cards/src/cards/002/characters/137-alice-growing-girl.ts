// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const aliceGrowingGirl: LorcanitoCharacterCard = {
//   id: "wfi",
//   reprints: ["rtw"],
//
//   name: "Alice",
//   title: "Growing Girl",
//   characteristics: ["hero", "dreamborn"],
//   text: "**GOOD ADVICE** Your other characters gain **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_\n\n**WHAT DID I DO?** While this character has 10 {S} or more, she gets +4 {L}.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Good Advice",
//       text: "Your other characters gain **Support**.",
//       gainedAbility: supportAbility,
//       target: yourOtherCharacters,
//     },
//     whileConditionThisCharacterGets({
//       name: "What did I Do?",
//       text: "While this character has 10 {S} or more, she gets +4 {L}.",
//       attribute: "lore",
//       amount: 4,
//       conditions: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           comparison: { operator: "gte", value: 10 },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 137,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527528,
//   },
//   rarity: "legendary",
// };
//
