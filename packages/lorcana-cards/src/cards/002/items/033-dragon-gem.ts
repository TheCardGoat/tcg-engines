import type { ItemCard } from "@tcg/lorcana-types";

export const dragonGem: ItemCard = {
  id: "1oa",
  cardType: "item",
  name: "Dragon Gem",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.",
  cost: 3,
  cardNumber: 33,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d949d7861529ad29092c24434a719aa73cfff97d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const dragonGem: LorcanitoItemCard = {
//   id: "mwf",
//   name: "Dragon Gem",
//   characteristics: ["item"],
//   text: "**BRING BACK TO LIFE** {E}, 3 {I} − Return a character card with **Support** from your discard to your hand.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Bring Back to Life",
//       text: "{E}, 3 {I} − Return a character card with **Support** from your discard to your hand.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "ability", value: "support" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Hope shines in even the darkest situations.",
//   colors: ["amber"],
//   cost: 3,
//   illustrator: "Andrew Trabbold",
//   number: 33,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526346,
//   },
//   rarity: "rare",
// };
//
