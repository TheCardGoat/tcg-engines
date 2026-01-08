import type { ActionCard } from "@tcg/lorcana-types";

export const freeze: ActionCard = {
  id: "1cq",
  cardType: "action",
  name: "Freeze",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  text: "Exert chosen opposing character.",
  cost: 2,
  cardNumber: 63,
  inkable: false,
  externalIds: {
    ravensburger: "adcdee7c29e76d6c7249456e6ff99ae44efe9e6e",
  },
  abilities: [
    {
      id: "1cq-1",
      text: "Exert chosen opposing character.",
      type: "action",
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const freeze: LorcanitoActionCard = {
//   id: "e7s",
//   name: "Freeze",
//   characteristics: ["action"],
//   text: "Exert chosen opposing character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Freeze",
//       text: "Exert chosen opposing character.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "It's time for you to chill.",
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Cristian Romero",
//   number: 63,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508733,
//   },
//   rarity: "common",
// };
//
