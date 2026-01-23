// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenOpposingCharacter,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const neroFearsomeCrocodile: LorcanitoCharacterCard = {
//   id: "oz8",
//   name: "Nero",
//   title: "Fearsome Crocodile",
//   characteristics: ["storyborn", "ally"],
//   text: "AND MEAN {E} – Move 1 damage counter from this character to chosen opposing character.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "AND MEAN",
//       text: "{E} – Move 1 damage counter from this character to chosen opposing character.",
//       costs: [{ type: "exert" }],
//       effects: [
//         moveDamageEffect({
//           amount: 1,
//           from: thisCharacter,
//           to: chosenOpposingCharacter,
//         }),
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Teresta Q.",
//   number: 65,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 633430,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
