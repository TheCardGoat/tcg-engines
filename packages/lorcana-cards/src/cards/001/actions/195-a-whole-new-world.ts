import type { ActionCard } from "@tcg/lorcana-types";

export const aWholeNewWorld: ActionCard = {
  id: "u8m",
  cardType: "action",
  name: "A Whole New World",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
  cost: 5,
  actionSubtype: "song",
  cardNumber: 195,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
      id: "u8m-1",
      effect: {
        type: "draw",
        amount: 7,
        target: "EACH_PLAYER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const aWholeNewWorld: LorcanitoActionCard = {
//   id: "u8m",
//   name: "A Whole New World",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "A Whole New World",
//       text: "Each player discards their hand and draws 7 cards.",
//       effects: [
//         {
//           type: "discard",
//           amount: 60,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "zone", value: "hand" }],
//           },
//         },
//         {
//           type: "draw",
//           amount: 7,
//           target: {
//             type: "player",
//             value: "all",
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Shining, shimmering, splendid . . .",
//   colors: ["steel"],
//   cost: 5,
//   illustrator: "Koni",
//   number: 195,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506088,
//   },
//   rarity: "super_rare",
// };
//
