// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   drawACard,
//   moveDamageEffect,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const makeSomeMagic: LorcanitoActionCard = {
//   id: "nle",
//   missingTestCase: true,
//   name: "Making Magic",
//   characteristics: ["action"],
//   text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//
//       resolveEffectsIndividually: true,
//       effects: [
//         moveDamageEffect({
//           amount: 1,
//           from: chosenCharacter,
//           to: chosenOpposingCharacter,
//         }),
//         drawACard,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Mario Oscar Gabriele",
//   number: 62,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593024,
//   },
//   rarity: "common",
// };
//
