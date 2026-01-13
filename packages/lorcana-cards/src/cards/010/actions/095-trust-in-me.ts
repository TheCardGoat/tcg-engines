import type { ActionCard } from "@tcg/lorcana-types";

export const trustInMe: ActionCard = {
  id: "1dp",
  cardType: "action",
  name: "Trust In Me",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Choose one:\n- Each opposing character gets -1 until the start of your next turn.\n- Each opponent chooses and discards 2 cards.",
  actionSubtype: "song",
  cost: 6,
  cardNumber: 95,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b17a10c1e0053183dab165c61690caaa7796d6a5",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   eachOpposingCharacter,
//   thisCard,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const trustInMe: LorcanitoActionCard = {
//   id: "wll",
//   name: "Trust In Me",
//   characteristics: ["action", "song"],
//   text: "Choose one: • Each opposing character gets -1 {L} until the start of your next turn. • Each opponent chooses and discards 2 cards.",
//   type: "action",
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 6,
//   illustrator: "Hadjie Joos",
//   number: 95,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658461,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "modal",
//           target: thisCard,
//           modes: [
//             {
//               id: "1",
//               text: "Each opposing character gets -1 {L} until the start of your next turn.",
//               effects: [
//                 {
//                   type: "attribute",
//                   attribute: "lore",
//                   modifier: "subtract",
//                   amount: 1,
//                   duration: "next_turn",
//                   until: true,
//                   target: eachOpposingCharacter,
//                 },
//               ],
//             },
//             {
//               id: "2",
//               text: "Each opponent chooses and discards 2 cards.",
//               responder: "opponent",
//               effects: [
//                 {
//                   type: "discard",
//                   amount: 2,
//                   target: {
//                     type: "card",
//                     value: 2,
//                     filters: [
//                       { filter: "zone", value: "hand" },
//                       { filter: "owner", value: "self" },
//                     ],
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//       resolveEffectsIndividually: false,
//       dependentEffects: false,
//       text: "Choose one: • Each opposing character gets -1 {L} until the start of your next turn. • Each opponent chooses and discards 2 cards.",
//     },
//   ],
// };
//
