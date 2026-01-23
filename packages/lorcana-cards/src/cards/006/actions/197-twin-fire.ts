import type { ActionCard } from "@tcg/lorcana-types";

export const twinFire: ActionCard = {
  id: "w3l",
  cardType: "action",
  name: "Twin Fire",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
  cost: 2,
  cardNumber: 197,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "73b07fd4a3e3b908b93c8d9272c0d97db0f6e2ff",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   anotherChosenCharacter,
//   chosenCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   dealDamageEffect,
//   discardACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const twinFire: LorcanitoActionCard = {
//   id: "c2j",
//   name: "Twin Fire",
//   characteristics: ["action"],
//   text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Twin Fire",
//       text: "Deal 2 damage to chosen character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacter,
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: chosenCharacter, // This will be replaced by the actual target from the first damage effect
//               optional: true,
//               responder: "self",
//               resolveEffectsIndividually: true,
//               effects: [
//                 discardACard,
//                 dealDamageEffect(2, anotherChosenCharacter),
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 2,
//   strength: 0,
//   illustrator: "Taraneth",
//   number: 197,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591992,
//   },
//   rarity: "common",
// };
//
