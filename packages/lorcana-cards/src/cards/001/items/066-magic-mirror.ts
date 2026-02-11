import type { ItemCard } from "@tcg/lorcana-types";

export const magicMirrorundefined: ItemCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      id: "bql-1",
      text: "**Speak** {E}, 4 {I} - Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 66,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Magic Mirror - undefined",
  id: "bql",
  inkType: ["amethyst"],
  inkable: true,
  name: "Magic Mirror",
  set: "001",
  text: "**Speak** {E}, 4 {I} - Draw a card.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Export const magicMirror: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "bql",
//   Reprints: ["z3v"],
//
//   Name: "Magic Mirror",
//   Text: "**Speak** {E}, 4 {I} - Draw a card.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 4 }],
//       Name: "Speak",
//       Text: "{E}, 4 {I} - Draw a card.",
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
//     } as ActivatedAbility,
//   ],
//   Flavour: '"What wouldst thou know, my Queen?"',
//   Colors: ["amethyst"],
//   Cost: 2,
//   Illustrator: "Andrew Trabbold",
//   Number: 66,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492714,
//   },
//   Rarity: "rare",
// };
//
