import type { ActionCard } from "@tcg/lorcana-types";

export const viciousBetrayal: ActionCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "a Villain character is chosen",
          type: "if",
        },
        then: {
          modifier: 3,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "e6i-1",
      text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
      type: "action",
    },
  ],
  cardNumber: 100,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Vicious Betrayal - undefined",
  id: "e6i",
  inkType: ["emerald"],
  inkable: true,
  name: "Vicious Betrayal",
  set: "001",
  text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { TargetConditionalEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const viciousBetrayal: LorcanitoActionCard = {
//   Id: "e6i",
//   Name: "Vicious Betrayal",
//   Characteristics: ["action"],
//   Text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "target-conditional",
//           AutoResolve: false,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["villain"] },
//             ],
//           },
//           Effects: [
//             {
//               Type: "attribute",
//               Attribute: "strength",
//               Amount: 3,
//               Modifier: "add",
//               Duration: "turn",
//               Target: {
//                 Type: "card",
//                 Value: 1,
//                 Filters: [
//                   { filter: "type", value: "character" },
//                   { filter: "zone", value: "play" },
//                   { filter: "characteristics", value: ["villain"] },
//                 ],
//               },
//             },
//           ],
//           Fallback: [
//             {
//               Type: "attribute",
//               Attribute: "strength",
//               Amount: 2,
//               Modifier: "add",
//               Duration: "turn",
//               Target: {
//                 Type: "card",
//                 Value: 1,
//                 Filters: [
//                   { filter: "type", value: "character" },
//                   { filter: "zone", value: "play" },
//                 ],
//               },
//             },
//           ],
//         } as TargetConditionalEffect,
//       ],
//     },
//   ],
//   Flavour: "A true king takes matters into his own claws. −Scar",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 1,
//   Illustrator: "Michaela Martin",
//   Number: 100,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506150,
//   },
//   Rarity: "common",
// };
//
