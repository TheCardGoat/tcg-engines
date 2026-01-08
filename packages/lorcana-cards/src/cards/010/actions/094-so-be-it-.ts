// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenItem,
//   eachOfYourCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const soBeIt: LorcanitoActionCard = {
//   id: "o2o",
//   name: "So Be It!",
//   characteristics: ["action"],
//   text: "Each of your characters gets +1 {S} this turn. You may banish chosen item.",
//   type: "action",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Valentina Graziuso",
//   number: 94,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658462,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Each of your characters gets +1 this turn. You may banish chosen item.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           modifier: "add",
//           amount: 1,
//           duration: "turn",
//           target: eachOfYourCharacters,
//         },
//         {
//           type: "banish",
//           target: chosenItem,
//         },
//       ],
//     },
//   ],
// };
//
