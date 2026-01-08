// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const underTheSea: LorcanitoActionCard = {
//   id: "s4i",
//   reprints: ["wlg"],
//   name: "Under The Sea",
//   characteristics: ["action", "song"],
//   text: "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
//   type: "action",
//   abilities: [
//     singerTogetherAbility(8),
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "move",
//           to: "deck",
//           bottom: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Such wonderful things surround you",
//   colors: ["emerald"],
//   cost: 8,
//   illustrator: "Dylan Bonner",
//   number: 95,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547844,
//   },
//   rarity: "rare",
// };
//
