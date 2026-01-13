// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
//
// export const scarab: LorcanitoItemCard = {
//   id: "pv5",
//   name: "Scarab",
//   characteristics: ["item"],
//   text: "SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.",
//   type: "item",
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Carlos Ruiz",
//   number: 83,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631404,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "activated",
//       name: "SEARCH THE SANDS",
//       text: "{E} 2 {I} – Return an Illusion character card from your discard to your hand.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["illusion"] },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
