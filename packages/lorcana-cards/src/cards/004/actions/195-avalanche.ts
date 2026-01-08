import type { ActionCard } from "@tcg/lorcana-types";

export const avalanche: ActionCard = {
  id: "1pv",
  cardType: "action",
  name: "Avalanche",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "Deal 1 damage to each opposing character. You may banish chosen location.",
  cost: 4,
  cardNumber: 195,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dd99c25c4f87c03bd08c6475bb933b3a8e370b00",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenLocation,
//   eachOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const avalanche: LorcanitoActionCard = {
//   id: "znd",
//   name: "Avalanche",
//   characteristics: ["action"],
//   text: "Deal 1 damage to each opposing character. You may banish chosen location.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: eachOpposingCharacter,
//         },
//       ],
//     },
//     {
//       type: "resolution",
//       optional: true,
//       effects: [
//         {
//           type: "banish",
//           target: chosenLocation,
//         },
//       ],
//     },
//   ],
//   flavour: "A little snow never hurt anyone. That big rock, however...",
//   colors: ["steel"],
//   cost: 4,
//   illustrator: "Justin Gerard",
//   number: 195,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550623,
//   },
//   rarity: "uncommon",
// };
//
