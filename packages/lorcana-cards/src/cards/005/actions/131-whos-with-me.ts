import type { ActionCard } from "@tcg/lorcana-types";

export const whosWithMe: ActionCard = {
  id: "4hv",
  cardType: "action",
  name: "Who's With Me?",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "Your characters get +2 {S} this turn.\nWhenever one of your characters with Reckless challenges another character this turn, gain 2 lore.",
  cost: 3,
  cardNumber: 131,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1034a66870b0c85f4a8a50bb74815569f3ec4b74",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const whosWithMe: LorcanitoActionCard = {
//   id: "hlq",
//   missingTestCase: true,
//   name: "Who's With Me?",
//   characteristics: ["action"],
//   text: "Your characters get +2 {S} this turn. \nWhenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: yourCharacters,
//         },
//       ],
//     },
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "ability",
//           duration: "turn",
//           modifier: "add",
//           ability: "custom",
//           customAbility: wheneverChallengesAnotherChar({
//             name: "Who's With Me?",
//             text: "Whenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
//             effects: [youGainLore(2)],
//           }),
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               { filter: "ability", value: "reckless" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: '"Don\'t forget, the purple unicorn is mine!"',
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Denny Minonne",
//   number: 131,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560637,
//   },
//   rarity: "super_rare",
// };
//
