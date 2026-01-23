import type { ItemCard } from "@tcg/lorcana-types";

export const whiteRabbitundefined: ItemCard = {
  id: "u45",
  cardType: "item",
  name: "White Rabbit",
  version: "undefined",
  fullName: "White Rabbit - undefined",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**I",
  cost: 3,
  cardNumber: 68,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const whiteRabbitPocketWatch: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "u45",
//   reprints: ["u14"],
//
//   name: "White Rabbit's Pocket Watch",
//   text: "**I'm late!** {E}, 1 {I} - Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "I'm late!",
//       text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "ability",
//           ability: "rush",
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour:
//     '"No wonder you\'re late. Why, this clock is exactly two days slow." −The Mad Hatter',
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Kamil Murzyn",
//   number: 68,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492712,
//   },
//   rarity: "rare",
// };
//
