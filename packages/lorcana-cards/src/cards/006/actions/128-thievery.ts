import type { ActionCard } from "@tcg/lorcana-types";

export const thievery: ActionCard = {
  id: "f60",
  cardType: "action",
  name: "Thievery",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Chosen opponent loses 1 lore. Gain 1 lore.",
  cost: 1,
  cardNumber: 128,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "36a9657a6b15dfe235ab7840e90fbe036a4aad9b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   opponentLoseLore,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const thievery: LorcanitoActionCard = {
//   id: "nf0",
//   missingTestCase: true,
//   name: "Thievery",
//   characteristics: ["action"],
//   text: "Chosen opponent loses 1 lore. Gain 1 lore.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Thievery",
//       text: "Chosen opponent loses 1 lore. Gain 1 lore.",
//       effects: [opponentLoseLore(1), youGainLore(1)],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Antoine Couttolenc",
//   number: 128,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588086,
//   },
//   rarity: "common",
// };
//
