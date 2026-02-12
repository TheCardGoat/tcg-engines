import type { ItemCard } from "@tcg/lorcana-types";

export const stolenScimitar: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: 1,
            stat: "strength",
            target: "CHOSEN_CHARACTER",
            type: "modify-stat",
          },
          {
            duration: "this-turn",
            modifier: 2,
            stat: "strength",
            target: "SELF",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      id: "17q-1",
      name: "SLASH",
      text: "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
      type: "activated",
    },
  ],
  cardNumber: 102,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "9d9f18605fc706396f03e12b4ffa1fdb3fcbf504",
  },
  franchise: "Aladdin",
  id: "17q",
  inkType: ["emerald"],
  inkable: true,
  name: "Stolen Scimitar",
  set: "001",
  text: "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type {
//   AttributeEffect,
//   TargetConditionalEffect,
// } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const targetingAladdin: AttributeEffect = {
//   Type: "attribute",
//   Attribute: "strength",
//   Amount: 2,
//   Modifier: "add",
//   Duration: "turn",
//   Target: {
//     Type: "card",
//     Value: 1,
//     Filters: [
//       { filter: "type", value: "character" },
//       { filter: "zone", value: "play" },
//       {
//         Filter: "attribute",
//         Value: "name",
//         Comparison: { operator: "eq", value: "aladdin" },
//       },
//     ],
//   },
// };
//
// Const notTargetingAladdin: AttributeEffect = {
//   Type: "attribute",
//   Attribute: "strength",
//   Amount: 1,
//   Modifier: "add",
//   Duration: "turn",
//   Target: {
//     Type: "card",
//     Value: 1,
//     Filters: [
//       { filter: "type", value: "character" },
//       { filter: "zone", value: "play" },
//     ],
//   },
// };
//
// Export const stolenScimitar: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "h98",
//
//   Name: "Stolen Scimitar",
//   Text: "**SLASH** {E} − Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Slash",
//       Text: "Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "target-conditional",
//           AutoResolve: false,
//           // move condition to a separate object, so the filter is the same
//           Effects: [targetingAladdin],
//           Fallback: [notTargetingAladdin],
//           // TODO: Re implement conditional target
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "attribute",
//                 Value: "name",
//                 Comparison: { operator: "eq", value: "aladdin" },
//               },
//             ],
//           },
//         } as TargetConditionalEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour: "Sometimes you've got to take what you can get.",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Illustrator: "Kendall Hale",
//   Number: 102,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507262,
//   },
//   Rarity: "common",
// };
//
