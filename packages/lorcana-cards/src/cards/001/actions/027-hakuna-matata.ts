import type { ActionCard } from "@tcg/lorcana-types";

export const hakunaMatata: ActionCard = {
  id: "10e",
  cardType: "action",
  name: "Hakuna Matata",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "Remove up to 3 damage from each of your characters.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 27,
  inkable: true,
  externalIds: {
    ravensburger: "820f02f5beebca54dc425f38c78f9f8bccea8dea",
  },
  abilities: [
    {
      id: "10e-1",
      text: "Remove up to 3 damage from each of your characters.",
      name: "Hakuna Matata",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          cardTypes: ["character"],
        },
        upTo: true,
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hakunaMatata: LorcanitoActionCard = {
//   id: "ege",
//   name: "Hakuna Matata",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nRemove up to 3 damage from each of your characters.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Hakuna Matata",
//       text: "Remove up to 3 damage from each of your characters.",
//       effects: [
//         {
//           type: "heal",
//           amount: 3,
//           upTo: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "What a wonderful phrase!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   illustrator: "Juan Diego Leon",
//   number: 27,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506124,
//   },
//   rarity: "common",
// };
//
