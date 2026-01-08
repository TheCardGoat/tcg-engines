import type { ItemCard } from "@tcg/lorcana-types";

export const beastundefined: ItemCard = {
  id: "ysg",
  cardType: "item",
  name: "Beast",
  version: "undefined",
  fullName: "Beast - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
  cost: 2,
  cardNumber: 201,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
      id: "ysg-1",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have no cards in your hand",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// export const beastMirror: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "ysg",
//   reprints: ["ysy"],
//
//   name: "Beast's Mirror",
//   text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Show Me",
//       text: "If you have no cards in your hand, draw a card.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           } as EffectTargets,
//         },
//       ],
//       conditions: [
//         {
//           type: "hand",
//           amount: 0,
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour:
//     "Ashamed of his monstrous form, the Beast concealed himself inside his castle, with a magic mirror as his only window to the outside world.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Samanta Erdini",
//   number: 201,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493486,
//   },
//   rarity: "common",
// };
//
