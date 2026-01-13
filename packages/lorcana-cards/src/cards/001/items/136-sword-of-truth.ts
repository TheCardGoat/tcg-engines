import type { ItemCard } from "@tcg/lorcana-types";

export const swordOfTruth: ItemCard = {
  id: "jpg",
  cardType: "item",
  name: "Sword of Truth",
  version: "undefined",
  fullName: "Sword of Truth - undefined",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.",
  cost: 4,
  cardNumber: 136,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const swordOfTruth: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "jpg",
//
//   name: "Sword of Truth",
//   text: "**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Final Enchantment",
//       text: "Banish this item − Banish chosen Villain character.",
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["villain"] },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour: "Almost as powerful as True Love's Kiss.",
//   colors: ["ruby"],
//   cost: 4,
//   illustrator: "Andrew Trabbold",
//   number: 136,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508793,
//   },
//   rarity: "rare",
// };
//
