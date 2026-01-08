// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const orRewriteHistory: LorcanitoActionCard = {
//   id: "srx",
//   missingTestCase: false,
//   name: "Or Rewrite History!",
//   characteristics: ["action", "song"],
//   text: "Return a character card from your discard to your hand.",
//   type: "action",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   illustrator: "Carlos Gomes Cabral",
//   number: 27,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659463,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               {
//                 filter: "zone",
//                 value: "discard",
//               },
//               {
//                 filter: "owner",
//                 value: "self",
//               },
//             ],
//           },
//         },
//       ],
//       resolveEffectsIndividually: false,
//       dependentEffects: false,
//       text: "Return a character card from your discard to your hand.",
//     },
//   ],
// };
//
