import type { ActionCard } from "@tcg/lorcana-types";

export const stampede: ActionCard = {
  id: "1fs",
  cardType: "action",
  name: "Stampede",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "001",
  text: "Deal 2 damage to chosen damaged character.",
  cost: 1,
  cardNumber: 96,
  inkable: false,
  externalIds: {
    ravensburger: "b7ee67706e4c50411acea0e129205737bfde9ac9",
  },
  abilities: [
    {
      id: "1fs-1",
      text: "Deal 2 damage to chosen damaged character.",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { DamageEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const stampede: LorcanitoActionCard = {
//   id: "eje",
//   name: "Stampede",
//   characteristics: ["action"],
//   text: "Deal 2 damage to chosen damaged character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Stampede",
//       text: "Deal 2 damage to chosen damaged character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenDamagedCharacter,
//         } as DamageEffect,
//       ],
//     },
//   ],
//   flavour:
//     "A wildebeest stampede is like a raging river: best experienced from a distance.",
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Matt Chapman",
//   number: 96,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505953,
//   },
//   rarity: "common",
// };
//
