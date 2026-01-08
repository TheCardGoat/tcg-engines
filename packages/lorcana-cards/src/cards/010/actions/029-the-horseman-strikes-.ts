// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterWithEvasive } from "@lorcanito/lorcana-engine/abilities/target";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theHorsemanStrikes: LorcanitoActionCard = {
//   id: "uka",
//   name: "The Horseman Strikes!",
//   characteristics: ["action"],
//   text: "Draw a card. You may banish chosen character with Evasive.",
//   type: "action",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   illustrator: "Jaime Puga",
//   number: 29,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660036,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Draw a card.",
//       effects: [drawACard],
//     },
//     {
//       type: "resolution",
//       optional: true,
//       text: "You may banish chosen character with Evasive.",
//       effects: [
//         {
//           type: "banish",
//           target: chosenCharacterWithEvasive,
//         },
//       ],
//     },
//   ],
// };
//
