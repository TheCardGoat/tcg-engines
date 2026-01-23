import type { ActionCard } from "@tcg/lorcana-types";

export const bePrepared: ActionCard = {
  id: "j9z",
  cardType: "action",
  name: "Be Prepared",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "001",
  text: "Banish all characters.",
  actionSubtype: "song",
  cost: 7,
  cardNumber: 128,
  inkable: false,
  externalIds: {
    ravensburger: "4579dd841c902f1f7a336b3776c97a974e5f3369",
  },
  abilities: [
    {
      id: "j9z-1",
      text: "Banish all characters.",
      type: "action",
      effect: {
        type: "banish",
        target: "ALL_CHARACTERS",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const bePrepared: LorcanitoActionCard = {
//   id: "z06",
//   name: "Be Prepared",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 7 or more can {E} to sing this\nsong for free.)_\nBanish all characters.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Be Prepared",
//       text: "Banish all characters.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Out teeth and ambitions are bared!",
//   colors: ["ruby"],
//   cost: 7,
//   illustrator: "Jared Nickerl",
//   number: 128,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506077,
//   },
//   rarity: "rare",
// };
//
