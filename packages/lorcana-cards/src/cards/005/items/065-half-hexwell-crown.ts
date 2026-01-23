import type { ItemCard } from "@tcg/lorcana-types";

export const halfHexwellCrown: ItemCard = {
  id: "1fp",
  cardType: "item",
  name: "Half Hexwell Crown",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  text: "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.\nA PERILOUS POWER {E}, 2 {I}, Discard a card — Exert chosen character.",
  cost: 6,
  cardNumber: 65,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b811b3defd86d738200c72437085b562903d888b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCardFromYourHand } from "@lorcanito/lorcana-engine/abilities/targets";
//
// import {
//   drawACard,
//   exertChosenCharacter,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const halfHexwellCrown: LorcanitoItemCard = {
//   id: "tj0",
//   missingTestCase: true,
//   name: "Half Hexwell Crown",
//   characteristics: ["item"],
//   text: "**AN UNEXPECTED FIND**, {E}, 2 {I} — Draw a card. *A PERILOUS POWER** {E}, 2 {I}, Discard a card – Exert chosen character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "AN UNEXPECTED FIND",
//       text: "{E}, 2 {I} — Draw a card.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       effects: [drawACard],
//     },
//     {
//       type: "activated",
//       name: "A PERILOUS POWER",
//       text: "{E}, 2 {I}, Discard a card – Exert chosen character.",
//       costs: [
//         { type: "exert" },
//         { type: "ink", amount: 2 },
//         {
//           type: "card",
//           action: "discard",
//           amount: 1,
//           filters: chosenCardFromYourHand.filters,
//         },
//       ],
//       effects: [exertChosenCharacter],
//     },
//   ],
//   flavour: "The broken crown holds dark and mysterious powers.",
//   colors: ["amethyst"],
//   cost: 6,
//   illustrator: "John Loren",
//   number: 65,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561474,
//   },
//   rarity: "rare",
// };
//
