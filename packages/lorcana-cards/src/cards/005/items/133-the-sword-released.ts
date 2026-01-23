import type { ItemCard } from "@tcg/lorcana-types";

export const theSwordReleased: ItemCard = {
  id: "fy1",
  cardType: "item",
  name: "The Sword Released",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "POWER APPOINTED At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
  cost: 3,
  cardNumber: 133,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3978188633160fe7db7bc875815de9594fe4e400",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import {
//   opponentLoseLore,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theSwordReleased: LorcanitoItemCard = {
//   id: "v7f",
//   missingTestCase: true,
//   name: "The Sword Released",
//   characteristics: ["item"],
//   text: "**POWER APPOINTED** At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
//   type: "item",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "Power Appointed",
//       text: "At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
//       conditions: [{ type: "have-strongest-character" }],
//       effects: [youGainLore(1), opponentLoseLore(1)],
//     }),
//   ],
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Mario Oscar Gabriele",
//   number: 133,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560544,
//   },
//   rarity: "rare",
// };
//
