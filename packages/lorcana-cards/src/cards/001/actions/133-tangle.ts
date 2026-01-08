import type { ActionCard } from "@tcg/lorcana-types";

export const tangle: ActionCard = {
  id: "1ly",
  cardType: "action",
  name: "Tangle",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "001",
  text: "Each opponent loses 1 lore.",
  cost: 2,
  cardNumber: 133,
  inkable: true,
  externalIds: {
    ravensburger: "d0e86cdf581903f6ffa738cc6e7a138625d40ed2",
  },
  abilities: [
    {
      id: "1ly-1",
      text: "Each opponent loses 1 lore.",
      type: "action",
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const tangle: LorcanitoActionCard = {
//   id: "kni",
//   name: "Tangle",
//   characteristics: ["action"],
//   text: "Each opponent loses 1 lore.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "lore",
//           amount: 1,
//           modifier: "subtract",
//           target: {
//             type: "player",
//             value: "opponent",
//           },
//         } as LoreEffect,
//       ],
//     },
//   ],
//   flavour:
//     "Stay right here! I mean, you don't have a choice, I guess. But still! Don't move! \n− Rapunzel",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Eri Welli",
//   number: 133,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508598,
//   },
//   rarity: "common",
// };
//
