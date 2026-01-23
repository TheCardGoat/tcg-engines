import type { ActionCard } from "@tcg/lorcana-types";

export const viciousBetrayal: ActionCard = {
  id: "e6i",
  cardType: "action",
  name: "Vicious Betrayal",
  version: "undefined",
  fullName: "Vicious Betrayal - undefined",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
  cost: 1,
  cardNumber: 100,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
      id: "e6i-1",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "a Villain character is chosen",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "CHOSEN_CHARACTER",
        },
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { TargetConditionalEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const viciousBetrayal: LorcanitoActionCard = {
//   id: "e6i",
//   name: "Vicious Betrayal",
//   characteristics: ["action"],
//   text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "target-conditional",
//           autoResolve: false,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["villain"] },
//             ],
//           },
//           effects: [
//             {
//               type: "attribute",
//               attribute: "strength",
//               amount: 3,
//               modifier: "add",
//               duration: "turn",
//               target: {
//                 type: "card",
//                 value: 1,
//                 filters: [
//                   { filter: "type", value: "character" },
//                   { filter: "zone", value: "play" },
//                   { filter: "characteristics", value: ["villain"] },
//                 ],
//               },
//             },
//           ],
//           fallback: [
//             {
//               type: "attribute",
//               attribute: "strength",
//               amount: 2,
//               modifier: "add",
//               duration: "turn",
//               target: {
//                 type: "card",
//                 value: 1,
//                 filters: [
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
//   flavour: "A true king takes matters into his own claws. −Scar",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Michaela Martin",
//   number: 100,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506150,
//   },
//   rarity: "common",
// };
//
