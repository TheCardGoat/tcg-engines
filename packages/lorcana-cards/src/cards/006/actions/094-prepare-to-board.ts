import type { ActionCard } from "@tcg/lorcana-types";

export const prepareToBoard: ActionCard = {
  id: "lql",
  cardType: "action",
  name: "Prepare to Board!",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
  cost: 1,
  cardNumber: 94,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4e596a3444f05ec541e3386bc403faa66729f7d0",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import type { TargetConditionalEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const prepareToBoard: LorcanitoActionCard = {
//   id: "xwq",
//   name: "Prepare To Board!",
//   characteristics: ["action"],
//   text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
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
//               { filter: "characteristics", value: ["pirate"] },
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
//                   { filter: "characteristics", value: ["pirate"] },
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
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Toni Bruno",
//   number: 94,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587968,
//   },
//   rarity: "common",
// };
//
