import type { ActionCard } from "@tcg/lorcana-types";

export const tangle: ActionCard = {
  abilities: [
    {
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "1ly-1",
      text: "Each opponent loses 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 133,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "d0e86cdf581903f6ffa738cc6e7a138625d40ed2",
  },
  franchise: "Tangled",
  id: "1ly",
  inkType: ["ruby"],
  inkable: true,
  name: "Tangle",
  set: "001",
  text: "Each opponent loses 1 lore.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const tangle: LorcanitoActionCard = {
//   Id: "kni",
//   Name: "Tangle",
//   Characteristics: ["action"],
//   Text: "Each opponent loses 1 lore.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "lore",
//           Amount: 1,
//           Modifier: "subtract",
//           Target: {
//             Type: "player",
//             Value: "opponent",
//           },
//         } as LoreEffect,
//       ],
//     },
//   ],
//   Flavour:
//     "Stay right here! I mean, you don't have a choice, I guess. But still! Don't move! \n− Rapunzel",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 2,
//   Illustrator: "Eri Welli",
//   Number: 133,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508598,
//   },
//   Rarity: "common",
// };
//
