// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { BanishEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const worldsGreatestCriminalMind: LorcanitoActionCard = {
//   id: "c97",
//   reprints: ["qp7"],
//
//   name: "World's Greatest Criminal Mind",
//   characteristics: ["action", "song"],
//   text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nBanish chosen character with 5 {S} or more.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "World's Greatest Criminal Mind",
//       text: "Banish chosen character with 5 {S} or more.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "gte", value: 5 },
//               },
//             ],
//           },
//         } as BanishEffect,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   illustrator: "Giulia Riva",
//   number: 31,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526209,
//   },
//   rarity: "rare",
// };
//
