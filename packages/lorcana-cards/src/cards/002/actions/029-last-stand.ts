import type { ActionCard } from "@tcg/lorcana-types";

export const lastStand: ActionCard = {
  id: "e4d",
  cardType: "action",
  name: "Last Stand",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Banish chosen character who was challenged this turn.",
  cost: 2,
  cardNumber: 29,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "32e50e39d9753fadc5753212222ae6fc6b0d2376",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const lastStand: LorcanitoActionCard = {
//   id: "yh3",
//
//   name: "Last Stand",
//   characteristics: ["action"],
//   text: "Banish chosen character who was challenged this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Banish chosen character who was challenged this turn.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "was-challenged" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Let's finish this, binturi.\n–Namaari",
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Aisha Durmagambetova",
//   number: 29,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 520861,
//   },
//   rarity: "uncommon",
// };
//
