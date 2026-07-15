import type { ItemCard } from "@tcg/lorcana-types";

export const beastundefined: ItemCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have no cards in your hand",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "ysg-1",
      text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
      type: "action",
    },
  ],
  cardNumber: 201,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Beast - undefined",
  id: "ysg",
  inkType: ["steel"],
  inkable: true,
  name: "Beast",
  set: "001",
  text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Export const beastMirror: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "ysg",
//   Reprints: ["ysy"],
//
//   Name: "Beast's Mirror",
//   Text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Show Me",
//       Text: "If you have no cards in your hand, draw a card.",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           } as EffectTargets,
//         },
//       ],
//       Conditions: [
//         {
//           Type: "hand",
//           Amount: 0,
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     "Ashamed of his monstrous form, the Beast concealed himself inside his castle, with a magic mirror as his only window to the outside world.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Illustrator: "Samanta Erdini",
//   Number: 201,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493486,
//   },
//   Rarity: "common",
// };
//
