import type { ActionCard } from "@tcg/lorcana-types";

export const loseTheWay: ActionCard = {
  id: "1um",
  cardType: "action",
  name: "Lose the Way",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
  cost: 2,
  cardNumber: 63,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "efd47478baf36aa353f4ec8a99d33cc331c1b1f6",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   sourceTarget,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   discardACard,
//   exertChosenCharacter,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const loseTheWay: LorcanitoActionCard = {
//   id: "la7",
//   name: "Lose The Way",
//   characteristics: ["action"],
//   text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
//   type: "action",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Douglas De La Hoz",
//   number: 63,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587754,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Lose The Way",
//       text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
//       effects: [
//         {
//           ...exertChosenCharacter,
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: thisCharacter,
//               replaceEffectTarget: true,
//               resolveEffectsIndividually: true,
//               optional: true,
//               effects: [
//                 {
//                   type: "restriction",
//                   restriction: "ready-at-start-of-turn",
//                   duration: "next_turn",
//                   until: true,
//                   target: sourceTarget,
//                 },
//                 discardACard,
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
