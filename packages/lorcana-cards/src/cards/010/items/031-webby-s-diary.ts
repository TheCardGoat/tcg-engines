// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const webbysDiary: LorcanitoItemCard = {
//   id: "tj4",
//   name: "Webby's Diary",
//   characteristics: ["item"],
//   text: "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
//   type: "item",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   illustrator: "Julie Vu",
//   number: 31,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658789,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "static-triggered",
//       trigger: {
//         on: "put-a-card-under",
//         target: {
//           type: "card",
//           value: "all",
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: ["character", "location"] },
//             { filter: "zone", value: "play" },
//           ],
//         },
//       },
//       name: "LATEST ENTRY",
//       text: "Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
//       layer: {
//         type: "resolution",
//         optional: true,
//         name: "LATEST ENTRY",
//         text: "you may pay 1 {I} to draw a card.",
//         effects: [drawACard],
//         costs: [{ type: "ink", amount: 1 }],
//       },
//     },
//   ],
// };
//
