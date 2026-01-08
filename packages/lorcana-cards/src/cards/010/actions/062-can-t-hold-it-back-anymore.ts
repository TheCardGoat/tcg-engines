// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   allCharacters,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { moveAllDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const cantHoldItBackAnymore: LorcanitoActionCard = {
//   id: "mk4",
//   name: "Can't Hold It Back Anymore",
//   characteristics: ["action", "song"],
//   text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
//   type: "action",
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 4,
//   illustrator: "E. Meldrandi / Mario O. Gabriele",
//   number: 62,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658499,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenOpposingCharacter,
//         },
//         moveAllDamageEffect({
//           to: chosenOpposingCharacter,
//           from: allCharacters,
//         }),
//       ],
//     },
//   ],
// };
//
