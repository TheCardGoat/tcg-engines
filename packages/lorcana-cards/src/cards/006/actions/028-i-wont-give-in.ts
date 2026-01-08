import type { ActionCard } from "@tcg/lorcana-types";

export const iWontGiveIn: ActionCard = {
  id: "v73",
  cardType: "action",
  name: "I Won't Give In",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  text: "Return a character card with cost 2 or less from your discard to your hand.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 28,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "706fa1412f17c17eec43c565c3816da3af922fe6",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const iWontGiveIn: LorcanitoActionCard = {
//   id: "ke2",
//   missingTestCase: true,
//   name: "I Won't Give In",
//   characteristics: ["song", "action"],
//   text: "(A character with cost 2 or more can {E} to sing this song for free.)\nReturn a character card with cost 2 or less from your discard to your hand.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "I Won't Give In",
//       text: "Return a character card with cost 2 or less from your discard to your hand.",
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
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Natalia Trykowska",
//   number: 28,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588087,
//   },
//   rarity: "common",
// };
//
