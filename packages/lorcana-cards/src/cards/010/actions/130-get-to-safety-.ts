// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { thisCard } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const getToSafety: LorcanitoActionCard = {
//   Id: "e4i",
//   Name: "Get to Safety!",
//   Characteristics: ["action"],
//   Text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 1,
//   Illustrator: "Sebastian Pinson",
//   Number: 130,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 660023,
//   },
//   Rarity: "rare",
//   Abilities: [
//     {
//       Type: "resolution",
//       ResolveEffectsIndividually: true,
//       DependentEffects: false,
//       Text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
//       Effects: [
//         {
//           Type: "play",
//           ForFree: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "location" },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 Comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//           AfterEffect: [
//             {
//               Type: "create-layer-based-on-target",
//               Responder: "self",
//               Target: thisCard,
//               Effects: [
//                 {
//                   Type: "draw",
//                   Amount: 1,
//                   Target: {
//                     Type: "player",
//                     Value: "self",
//                   },
//                   Conditions: [
//                     {
//                       Type: "filter",
//                       Comparison: { operator: "gte", value: 1 },
//                       Filters: [
//                         { filter: "owner", value: "self" },
//                         { filter: "zone", value: "play" },
//                         { filter: "type", value: "location" },
//                         {
//                           Filter: "attribute",
//                           Value: "name",
//                           Comparison: {
//                             Operator: "eq",
//                             Value: "Sleepy Hollow",
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
