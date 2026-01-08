import type { ActionCard } from "@tcg/lorcana-types";

export const friendsOnTheOtherSide: ActionCard = {
  id: "a41",
  cardType: "action",
  name: "Friends on the Other Side",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  text: "Draw 2 cards.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 64,
  inkable: true,
  externalIds: {
    ravensburger: "248406633c5253dbfe3569d61c9feaa738ab3a84",
  },
  abilities: [
    {
      id: "a41-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "Draw 2 cards.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const friendsOnTheOtherSide: LorcanitoActionCard = {
//   id: "rrg",
//   name: "Friends On The Other Side",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 3 or more can {E} to sing this song \rfor free.)_\n\rDraw 2 cards.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "draw",
//           amount: 2,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//       text: "Draw 2 cards.",
//     },
//   ],
//   flavour: "The cards, the cards<br />\rthe cards will tell . . .",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Amber Kommavongsa",
//   number: 64,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494100,
//   },
//   rarity: "common",
// };
//
