import type { ActionCard } from "@tcg/lorcana-types";

export const revive: ActionCard = {
  id: "16b",
  cardType: "action",
  name: "Revive",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "005",
  text: "Play a character card with cost 5 or less from your discard for free.",
  cost: 5,
  cardNumber: 27,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "97dd8cdfab89963b2a8c0116f6a21bf32932860e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const revive: LorcanitoActionCard = {
//   id: "xie",
//   missingTestCase: true,
//   name: "Revive",
//   characteristics: ["action"],
//   text: "Play a character card with cost 5 or less from your discard for free.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 5 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Not all that is lost is gone forever.",
//   colors: ["amber"],
//   cost: 5,
//   illustrator: "Jared Matthews",
//   number: 27,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561469,
//   },
//   rarity: "rare",
// };
//
