import type { ActionCard } from "@tcg/lorcana-types";

export const visionOfTheFuture: ActionCard = {
  id: "xym",
  cardType: "action",
  name: "Vision of the Future",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
  cost: 2,
  cardNumber: 160,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0366689dbfdf33fe2cb12178345f2f0b38c13555",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const visionOfTheFuture: LorcanitoActionCard = {
//   id: "aks",
//   missingTestCase: true,
//   name: "Vision of the Future",
//   characteristics: ["action"],
//   text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 5,
//           mode: "bottom",
//           shouldRevealTutored: false,
//           target: self,
//           limits: {
//             bottom: 4,
//             inkwell: 0,
//             hand: 1,
//             top: 0,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//           ],
//         },
//       ],
//     },
//   ],
//   flavour:
//     "We must repair the Illuminary before it’s too late. And we’ll need these devices, these chromicons, to fix it.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Leonardo Giammichele",
//   number: 160,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561652,
//   },
//   rarity: "common",
// };
//
