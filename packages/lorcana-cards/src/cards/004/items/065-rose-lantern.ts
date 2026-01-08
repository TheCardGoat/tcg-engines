// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const roseLantern: LorcanitoItemCard = {
//   id: "xin",
//   reprints: ["j0w"],
//   missingTestCase: true,
//   name: "Rose Lantern",
//   characteristics: ["item"],
//   text: "MYSTICAL PETALS  {E}, 2 {I} − Move 1 damage counter from chosen character to chosen opposing character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Mystical Petals",
//       text: "{E}, 2 {I} − Move 1 damage counter from chosen character to chosen opposing character.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       effects: [
//         moveDamageEffect({
//           amount: 1,
//           from: chosenCharacter,
//           to: chosenOpposingCharacter,
//         }),
//       ],
//     },
//   ],
//   flavour:
//     "The transformed rose made short work of the Beast's wound. But even the gentlest magic comes at a cost.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Gabriel Angelo",
//   number: 65,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550573,
//   },
//   rarity: "common",
// };
//
