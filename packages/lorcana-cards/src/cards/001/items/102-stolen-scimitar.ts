import type { ItemCard } from "@tcg/lorcana-types";

export const stolenScimitar: ItemCard = {
  id: "17q",
  cardType: "item",
  name: "Stolen Scimitar",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  text: "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
  cost: 2,
  cardNumber: 102,
  inkable: true,
  externalIds: {
    ravensburger: "9d9f18605fc706396f03e12b4ffa1fdb3fcbf504",
  },
  abilities: [
    {
      id: "17q-1",
      text: "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
      name: "SLASH",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type {
//   AttributeEffect,
//   TargetConditionalEffect,
// } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const targetingAladdin: AttributeEffect = {
//   type: "attribute",
//   attribute: "strength",
//   amount: 2,
//   modifier: "add",
//   duration: "turn",
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "type", value: "character" },
//       { filter: "zone", value: "play" },
//       {
//         filter: "attribute",
//         value: "name",
//         comparison: { operator: "eq", value: "aladdin" },
//       },
//     ],
//   },
// };
//
// const notTargetingAladdin: AttributeEffect = {
//   type: "attribute",
//   attribute: "strength",
//   amount: 1,
//   modifier: "add",
//   duration: "turn",
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "type", value: "character" },
//       { filter: "zone", value: "play" },
//     ],
//   },
// };
//
// export const stolenScimitar: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "h98",
//
//   name: "Stolen Scimitar",
//   text: "**SLASH** {E} − Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Slash",
//       text: "Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "target-conditional",
//           autoResolve: false,
//           // move condition to a separate object, so the filter is the same
//           effects: [targetingAladdin],
//           fallback: [notTargetingAladdin],
//           // TODO: Re implement conditional target
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "aladdin" },
//               },
//             ],
//           },
//         } as TargetConditionalEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour: "Sometimes you've got to take what you can get.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Kendall Hale",
//   number: 102,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507262,
//   },
//   rarity: "common",
// };
//
