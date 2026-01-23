import type { ActionCard } from "@tcg/lorcana-types";

export const hesGotASword: ActionCard = {
  id: "1hz",
  cardType: "action",
  name: "He's Got a Sword!",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "001",
  text: "Chosen character gets +2 {S} this turn.",
  cost: 1,
  cardNumber: 132,
  inkable: true,
  externalIds: {
    ravensburger: "c286fc16a13143ed3d347c25f5f85877a90a8bd5",
  },
  abilities: [
    {
      id: "1hz-1",
      text: "Chosen character gets +2 {S} this turn.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hesGotASword: LorcanitoActionCard = {
//   id: "wmw",
//   name: "He's Got a Sword!",
//   characteristics: ["action"],
//   text: "Chosen character gets +2 {S} this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "We've all got swords! \n−Razoul",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Koni",
//   number: 132,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508782,
//   },
//   rarity: "common",
// };
//
