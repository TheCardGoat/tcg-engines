// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const itMeansNoWorries: LorcanitoActionCard = {
//   id: "u6f",
//   name: "It Means No Worries",
//   characteristics: ["action", "song"],
//   text: "Sing Together 9 (Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)\nReturn up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
//   type: "action",
//   inkwell: false,
//   colors: ["amber"],
//   cost: 9,
//   illustrator: "Gianluca Barone",
//   number: 42,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631380,
//   },
//   rarity: "rare",
//   abilities: [
//     singerTogetherAbility(9),
//     {
//       type: "resolution",
//       effects: [youPayXLessToPlayNextCharThisTurn(2)],
//     },
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 3,
//             upTo: true,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
