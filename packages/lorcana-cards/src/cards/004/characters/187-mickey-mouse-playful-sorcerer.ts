import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMousePlayfulSorcerer: CharacterCard = {
  id: "14q",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Playful Sorcerer",
  fullName: "Mickey Mouse - Playful Sorcerer",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "004",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nResist +1 (Damage dealt to this character is reduced by 1.)\nSWEEP AWAY When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 187,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "92ca31b3dd2f356cf1cd1d09a4c9d9744440282d",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   resistAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const mickeyMousePlayfulSorcerer: LorcanitoCharacterCard = {
//   id: "i3q",
//   name: "Mickey Mouse",
//   title: "Playful Sorcerer",
//   characteristics: ["hero", "floodborn", "sorcerer"],
//   text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse)_\n<br>\n**Resist** +1 _(Damage dealt to this character is reduced by 1.)_\n<br>\n**SWEEP AWAY** When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Mickey Mouse"),
//     resistAbility(1),
//     {
//       type: "resolution",
//       name: "SWEEP AWAY",
//       text: "When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.",
//       effects: [
//         {
//           type: "damage",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "characteristics", value: ["broom"] },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Alice Pisoni",
//   number: 187,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543909,
//   },
//   rarity: "rare",
// };
//
