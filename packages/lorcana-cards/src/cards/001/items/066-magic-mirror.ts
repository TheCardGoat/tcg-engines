import type { ItemCard } from "@tcg/lorcana-types";

export const magicMirrorundefined: ItemCard = {
  id: "bql",
  cardType: "item",
  name: "Magic Mirror",
  version: "undefined",
  fullName: "Magic Mirror - undefined",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**Speak** {E}, 4 {I} - Draw a card.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Speak** {E}, 4 {I} - Draw a card.",
      id: "bql-1",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// export const magicMirror: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "bql",
//   reprints: ["z3v"],
//
//   name: "Magic Mirror",
//   text: "**Speak** {E}, 4 {I} - Draw a card.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "exert" }, { type: "ink", amount: 4 }],
//       name: "Speak",
//       text: "{E}, 4 {I} - Draw a card.",
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
//     } as ActivatedAbility,
//   ],
//   flavour: '"What wouldst thou know, my Queen?"',
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Andrew Trabbold",
//   number: 66,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492714,
//   },
//   rarity: "rare",
// };
//
