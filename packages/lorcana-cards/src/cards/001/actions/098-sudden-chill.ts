import type { ActionCard } from "@tcg/lorcana-types";

export const suddenChill: ActionCard = {
  id: "pz4",
  cardType: "action",
  name: "Sudden Chill",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "Each opponent chooses and discards a card.",
  cost: 2,
  actionSubtype: "song",
  cardNumber: 98,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "Each opponent chooses and discards a card.",
      id: "pz4-1",
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const suddenChill: LorcanitoActionCard = {
//   id: "pz4",
//   reprints: ["f3l"],
//   name: "Sudden Chill",
//   characteristics: ["action", "song"],
//   text: "Each opponent chooses and discards a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Sudden Chill",
//       text: "Each opponent chooses and discards a card.",
//       optional: false,
//       responder: "opponent",
//       resolveImmediately: true,
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
//   ],
//   flavour:
//     "Cruella De Vil, Cruella De Vil \nIf she doesn't scare you, no evil thing will",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Giulia Riva",
//   number: 98,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508346,
//   },
//   rarity: "common",
// };
//
