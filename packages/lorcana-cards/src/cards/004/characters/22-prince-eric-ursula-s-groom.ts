// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   bodyguardAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   whileYouHaveACharacterNamedThisCharGains,
//   whileYouHaveACharacterNamedThisCharGets,
// } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const princeEricUrsulasGroom: LorcanitoCharacterCard = {
//   id: "k1b",
//   missingTestCase: true,
//   name: "Prince Eric",
//   title: "Ursula's Groom",
//   characteristics: ["hero", "floodborn", "prince"],
//   text: "**Shift 4** _(You may pay 4 {I} to play this on top of one of your characters named Prince Eric.)**\n\n\n**UNDER VANESSA'S SPELL** While you have a character named Ursula in play, this character gains **Bodyguard** and gets +2 {W}. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "prince eric"),
//     whileYouHaveACharacterNamedThisCharGains({
//       name: "Under Vanessa's Spell",
//       text: "While you have a character named Ursula in play, this character gains **Bodyguard**.",
//       characterName: "Ursula",
//       ability: bodyguardAbility,
//     }),
//     whileYouHaveACharacterNamedThisCharGets({
//       name: "Under Vanessa's Spell",
//       text: "While you have a character named Ursula in play, this character gets +2 {W}.",
//       characterName: "Ursula",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "willpower",
//           amount: 2,
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Lisanne Koeteeuw",
//   number: 22,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550561,
//   },
//   rarity: "uncommon",
// };
//
