// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { BanishEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const worldsGreatestCriminalMind: LorcanitoActionCard = {
//   Id: "c97",
//   Reprints: ["qp7"],
//
//   Name: "World's Greatest Criminal Mind",
//   Characteristics: ["action", "song"],
//   Text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nBanish chosen character with 5 {S} or more.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "World's Greatest Criminal Mind",
//       Text: "Banish chosen character with 5 {S} or more.",
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "attribute",
//                 Value: "strength",
//                 Comparison: { operator: "gte", value: 5 },
//               },
//             ],
//           },
//         } as BanishEffect,
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 3,
//   Illustrator: "Giulia Riva",
//   Number: 31,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 526209,
//   },
//   Rarity: "rare",
// };
//
