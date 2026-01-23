import type { ActionCard } from "@tcg/lorcana-types";

export const doItAgain: ActionCard = {
  id: "8s5",
  cardType: "action",
  name: "Do It Again!",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "001",
  text: "Return an action card from your discard to your hand.",
  cost: 3,
  cardNumber: 94,
  inkable: false,
  externalIds: {
    ravensburger: "1fa692d71466897743f12f7dbceee65c69c5d6a5",
  },
  abilities: [
    {
      id: "8s5-1",
      text: "Return an action card from your discard to your hand.",
      type: "action",
      effect: {
        type: "return-from-discard",
        cardType: "action",
        target: "CONTROLLER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const doItAgain: LorcanitoActionCard = {
//   id: "yld",
//   name: "Do It Again!",
//   characteristics: ["action"],
//   text: "Return an action card from your discard to your hand.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Do It Again!",
//       text: "Return an action card from your discard to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: ["action"] },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     ". . . Then scrub the terrace, sweep the halls and the stairs, clean the chimneys. And of course there's the mending, and the sewing, and the laundry . . . −Lady Tremaine",
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Ellie Horie",
//   number: 94,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506830,
//   },
//   rarity: "rare",
// };
//
