// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const iceSpikes: LorcanitoItemCard = {
//   id: "jvt",
//   missingTestCase: true,
//   name: "Ice Spikes",
//   characteristics: ["item"],
//   text: "HOLD STILL When you play this item, exert chosen opposing character.\nIT'S STUCK {E}, 1 {I} – Exert chosen opposing item. It can't ready at the start of its next turn.",
//   type: "item",
//   inkwell: true,
//   colors: ["amethyst", "sapphire"],
//   cost: 2,
//   illustrator: "Priya Kakati",
//   number: 84,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631405,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       name: "HOLD STILL",
//       text: "When you play this item, exert chosen opposing character.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     },
//     {
//       type: "activated",
//       name: "IT'S STUCK",
//       text: "{E}, 1 {I} – Exert chosen opposing item. It can't ready at the start of its next turn.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//         {
//           type: "restriction",
//           restriction: "ready-at-start-of-turn",
//           duration: "next_turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
