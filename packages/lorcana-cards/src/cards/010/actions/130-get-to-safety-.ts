// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { thisCard } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const getToSafety: LorcanitoActionCard = {
//   id: "e4i",
//   name: "Get to Safety!",
//   characteristics: ["action"],
//   text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
//   type: "action",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Sebastian Pinson",
//   number: 130,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660023,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       dependentEffects: false,
//       text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "location" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               responder: "self",
//               target: thisCard,
//               effects: [
//                 {
//                   type: "draw",
//                   amount: 1,
//                   target: {
//                     type: "player",
//                     value: "self",
//                   },
//                   conditions: [
//                     {
//                       type: "filter",
//                       comparison: { operator: "gte", value: 1 },
//                       filters: [
//                         { filter: "owner", value: "self" },
//                         { filter: "zone", value: "play" },
//                         { filter: "type", value: "location" },
//                         {
//                           filter: "attribute",
//                           value: "name",
//                           comparison: {
//                             operator: "eq",
//                             value: "Sleepy Hollow",
//                           },
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
