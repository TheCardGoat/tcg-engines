import type { ActionCard } from "@tcg/lorcana-types";

export const fragileAsAFlower: ActionCard = {
  id: "1im",
  cardType: "action",
  name: "Fragile as a Flower",
  inkType: ["amethyst"],
  franchise: "Tangled",
  set: "010",
  text: "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 65,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c4520386e5b3c0d4137f1da2eb502d9c3b7e6820",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterWithCostXorLess } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   drawACard,
//   exertAndCantReadyAtTheeStartOfTheirTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const fragileAsAFlower: LorcanitoActionCard = {
//   id: "qw8",
//   name: "Fragile As A Flower",
//   characteristics: ["action", "song"],
//   text: "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
//   type: "action",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Janel Reh",
//   number: 65,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659418,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Fragile As A Flower",
//       text: "Draw a card.",
//       effects: [drawACard],
//     },
//     {
//       type: "resolution",
//       name: "Fragile As A Flower",
//       text: "Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
//       effects: exertAndCantReadyAtTheeStartOfTheirTurn(
//         chosenCharacterWithCostXorLess(2),
//       ),
//     },
//   ],
// };
//
