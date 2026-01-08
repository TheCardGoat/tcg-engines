import type { ActionCard } from "@tcg/lorcana-types";

export const hypnoticDeduction: ActionCard = {
  id: "5ug",
  cardType: "action",
  name: "Hypnotic Deduction",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
  cost: 2,
  cardNumber: 94,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "15120252cebb874fa99bde7fc2f9934b81be20c8",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   drawXCards,
//   putCardFromYourHandOnTheTopOfYourDeck,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const hypnoticDeduction: LorcanitoActionCard = {
//   id: "z2p",
//   name: "Hypnotic Deduction",
//   characteristics: ["action"],
//   text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
//   type: "action",
//   abilities: [
//     {
//       name: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       effects: [
//         drawXCards(3),
//         putCardFromYourHandOnTheTopOfYourDeck,
//         putCardFromYourHandOnTheTopOfYourDeck,
//       ],
//     },
//   ],
//   flavour:
//     "A security device! Easily defeated, of course. Once I make room for the crown, I... can... bring... it... to... him.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Elodie Mondoloni",
//   number: 94,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561346,
//   },
//   rarity: "common",
// };
//
