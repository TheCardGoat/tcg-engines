import type { ActionCard } from "@tcg/lorcana-types";

export const ransack: ActionCard = {
  id: "1ux",
  cardType: "action",
  name: "Ransack",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "001",
  text: "Draw 2 cards, then choose and discard 2 cards.",
  cost: 2,
  cardNumber: 199,
  inkable: true,
  externalIds: {
    ravensburger: "f13778c7e4f55190ce7ec9958fcbfbbd0879d0e0",
  },
  abilities: [
    {
      id: "1ux-1",
      text: "Draw 2 cards, then choose and discard 2 cards.",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 2,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { DiscardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const ransack: LorcanitoActionCard = {
//   id: "cfx",
//   name: "Ransack",
//   characteristics: ["action"],
//   text: "Draw 2 cards, then choose and discard 2 cards.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "draw",
//           amount: 2,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//         {
//           type: "discard",
//           amount: 2,
//           target: {
//             type: "card",
//             value: 2,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//         } as DiscardEffect,
//       ],
//     },
//   ],
//   flavour: "Who has time to read labels?",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Amber Kommavongsa",
//   number: 199,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508937,
//   },
//   rarity: "uncommon",
// };
//
