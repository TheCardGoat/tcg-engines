import type { ActionCard } from "@tcg/lorcana-types";

export const youHaveForgottenMe: ActionCard = {
  id: "1cn",
  cardType: "action",
  name: "You Have Forgotten Me",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "Each opponent chooses and discards 2 cards.",
  cost: 4,
  cardNumber: 31,
  inkable: true,
  externalIds: {
    ravensburger: "af649d5bbf464478b0095af6a2bebd4bf32e467d",
  },
  abilities: [
    {
      id: "1cn-1",
      text: "Each opponent chooses and discards 2 cards.",
      type: "action",
      effect: {
        type: "discard",
        amount: 2,
        target: "EACH_OPPONENT",
        chosen: true,
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { DiscardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const youHaveForgottenMe: LorcanitoActionCard = {
//   id: "z53",
//   name: "You Have Forgotten Me",
//   characteristics: ["action"],
//   text: "Each opponent chooses and discards 2 cards.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "You Have Forgotten Me",
//       text: "Each opponent chooses and discards two cards.",
//       optional: false,
//       responder: "opponent",
//       effects: [
//         {
//           type: "discard",
//           amount: 2,
//           target: {
//             type: "card",
//             value: 2,
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         } as DiscardEffect,
//       ],
//     },
//   ],
//   flavour: "You are more than what you have become. \n−Mufasa",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   illustrator: "Alice Pisoni",
//   number: 31,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508716,
//   },
//   rarity: "uncommon",
// };
//
