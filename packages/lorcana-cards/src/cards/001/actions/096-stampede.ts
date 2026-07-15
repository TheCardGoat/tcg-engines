import type { ActionCard } from "@tcg/lorcana-types";

export const stampede: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      id: "1fs-1",
      text: "Deal 2 damage to chosen damaged character.",
      type: "action",
    },
  ],
  cardNumber: 96,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "b7ee67706e4c50411acea0e129205737bfde9ac9",
  },
  franchise: "Lion King",
  id: "1fs",
  inkType: ["emerald"],
  inkable: false,
  name: "Stampede",
  set: "001",
  text: "Deal 2 damage to chosen damaged character.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { DamageEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const stampede: LorcanitoActionCard = {
//   Id: "eje",
//   Name: "Stampede",
//   Characteristics: ["action"],
//   Text: "Deal 2 damage to chosen damaged character.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Stampede",
//       Text: "Deal 2 damage to chosen damaged character.",
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 2,
//           Target: chosenDamagedCharacter,
//         } as DamageEffect,
//       ],
//     },
//   ],
//   Flavour:
//     "A wildebeest stampede is like a raging river: best experienced from a distance.",
//   Colors: ["emerald"],
//   Cost: 1,
//   Illustrator: "Matt Chapman",
//   Number: 96,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 505953,
//   },
//   Rarity: "common",
// };
//
