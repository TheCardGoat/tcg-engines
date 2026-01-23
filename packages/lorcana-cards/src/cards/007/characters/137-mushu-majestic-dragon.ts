import type { CharacterCard } from "@tcg/lorcana-types";

export const mushuMajesticDragon: CharacterCard = {
  id: "bra",
  cardType: "character",
  name: "Mushu",
  version: "Majestic Dragon",
  fullName: "Mushu - Majestic Dragon",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  text: "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)\nGUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 137,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2a608171e87ca61b48b698e1fe5482c717572e13",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   wheneverOneOfYourCharChallengesAnotherChar,
//   wheneverOpposingCharIsBanishedInChallenge,
// } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mushuMajesticDragon: LorcanitoCharacterCard = {
//   id: "bn6",
//   name: "Mushu",
//   title: "Majestic Dragon",
//   characteristics: ["storyborn", "ally", "dragon"],
//   text: "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)\nGUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
//   type: "character",
//   abilities: [
//     wheneverOneOfYourCharChallengesAnotherChar({
//       name: "INTIMIDATING AND AWE-INSPIRING",
//       text: "Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       effects: [
//         {
//           type: "ability",
//           ability: "custom",
//           customAbility: resistAbility(2, true),
//           modifier: "add",
//           amount: 2,
//           duration: "challenge",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               {
//                 filter: "challenge",
//                 value: "attacker",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//
//     wheneverOpposingCharIsBanishedInChallenge({
//       name: "GUARDIAN OF LOST SOULS",
//       text: "During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       effects: [
//         {
//           type: "lore",
//           amount: 2,
//           modifier: "add",
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["ruby", "steel"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Tom Bancroft",
//   number: 137,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619482,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
