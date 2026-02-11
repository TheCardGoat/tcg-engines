import type { ActionCard } from "@tcg/lorcana-types";

export const ransack: ActionCard = {
  abilities: [
    {
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
      id: "1ux-1",
      text: "Draw 2 cards, then choose and discard 2 cards.",
      type: "action",
    },
  ],
  cardNumber: 199,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "f13778c7e4f55190ce7ec9958fcbfbbd0879d0e0",
  },
  franchise: "Emperors New Groove",
  id: "1ux",
  inkType: ["steel"],
  inkable: true,
  name: "Ransack",
  set: "001",
  text: "Draw 2 cards, then choose and discard 2 cards.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { DiscardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const ransack: LorcanitoActionCard = {
//   Id: "cfx",
//   Name: "Ransack",
//   Characteristics: ["action"],
//   Text: "Draw 2 cards, then choose and discard 2 cards.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 2,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//         {
//           Type: "discard",
//           Amount: 2,
//           Target: {
//             Type: "card",
//             Value: 2,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//         } as DiscardEffect,
//       ],
//     },
//   ],
//   Flavour: "Who has time to read labels?",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Illustrator: "Amber Kommavongsa",
//   Number: 199,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508937,
//   },
//   Rarity: "uncommon",
// };
//
