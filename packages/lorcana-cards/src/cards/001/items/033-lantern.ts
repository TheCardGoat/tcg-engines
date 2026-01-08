// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const lantern: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "ub2",
//   reprints: ["aa1"],
//
//   name: "Lantern",
//   text: "**BIRTHDAY LIGHTS** {E} - You pay 1 {I} less for the next character you play this turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Birthday Lights",
//       text: "{E} - You pay 1 {I} less for the next character you play this turn.",
//       optional: false,
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "next",
//           amount: 1,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "type", value: "character" }],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour:
//     "Lanterns fill the sky on one special night, beacons of hope and love.",
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Eri Welli",
//   number: 33,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493500,
//   },
//   rarity: "rare",
// };
//
