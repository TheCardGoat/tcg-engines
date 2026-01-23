import type { ActionCard } from "@tcg/lorcana-types";

export const breakCard: ActionCard = {
  id: "m37",
  cardType: "action",
  name: "Break",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Banish chosen item.",
  cost: 2,
  cardNumber: 196,
  inkable: true,
  externalIds: {
    ravensburger: "4f9cac8dbc4c67a388b8379dcc126c90c7c5e72a",
  },
  abilities: [
    {
      id: "m37-1",
      text: "Banish chosen item.",
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const breakAction: LorcanitoActionCard = {
//   id: "whn",
//   name: "Break",
//   characteristics: ["action"],
//   text: "Banish chosen item.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["item"] },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "No one throws a tantrum like a beast.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Grace Tran",
//   number: 196,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506000,
//   },
//   rarity: "common",
// };
//
