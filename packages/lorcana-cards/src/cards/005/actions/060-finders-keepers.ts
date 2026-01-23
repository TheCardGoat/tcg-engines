import type { ActionCard } from "@tcg/lorcana-types";

export const findersKeepers: ActionCard = {
  id: "q4f",
  cardType: "action",
  name: "Finders Keepers",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  text: "Draw 3 cards.",
  cost: 5,
  cardNumber: 60,
  inkable: true,
  externalIds: {
    ravensburger: "5e2657fa5dbffd004f504784ce267a28e50d742c",
  },
  abilities: [
    {
      id: "q4f-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      },
      text: "Draw 3 cards.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const findersKeepers: LorcanitoActionCard = {
//   id: "ko3",
//   missingTestCase: true,
//   name: "Finders Keepers",
//   characteristics: ["action"],
//   text: "Draw 3 cards.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Draw 3 cards.",
//       effects: [
//         {
//           type: "draw",
//           amount: 3,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     },
//   ],
//   flavour: '"Three wishes, comin\' right up!" \n— Iago',
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   illustrator: "Andy Estrada / Stefano Zanchi",
//   number: 60,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559087,
//   },
//   rarity: "uncommon",
// };
//
