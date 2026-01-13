// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const undermine: LorcanitoActionCard = {
//   id: "hbl",
//   missingTestCase: true,
//   name: "Undermine",
//   characteristics: ["action"],
//   text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
//   type: "action",
//   inkwell: true,
//   colors: ["emerald", "ruby"],
//   cost: 2,
//   illustrator: "Luigi Aimè",
//   number: 117,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631426,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       optional: false,
//       responder: "opponent",
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       type: "resolution",
//       effects: [chosenCharacterGetsStrength(2)],
//     },
//   ],
// };
//
