// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { anyCard, self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const notAnOrdinaryAppleAbility: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "exert" }],
//   Name: "NOT AN ORDINARY APPLE",
//   Text: "Choose 3 cards in an opponent's discard and put them under their deck to gain 3 lore. If you moved at least 1 Princess this way, gain 4 lore instead.",
//   Effects: [
//     {
//       Type: "move",
//       To: "deck",
//       Bottom: true,
//       Target: {
//         Type: "card",
//         Value: 3,
//         Filters: [
//           { filter: "zone", value: "discard" },
//           { filter: "owner", value: "opponent" },
//         ],
//       },
//       AfterEffect: [
//         {
//           Type: "create-layer-based-on-target",
//           Target: anyCard, // TODO: Revisit this
//           Filters: [{ filter: "characteristics", value: ["princess"] }],
//           NumberOfMatchingTargets: {
//             Operator: "gte",
//             Value: 1,
//           },
//           Effects: [
//             {
//               Type: "lore",
//               Amount: 4,
//               Modifier: "add",
//               Target: self,
//             },
//           ],
//           Fallback: [
//             {
//               Type: "lore",
//               Amount: 3, // Changed from 4 to 3 as per the card text
//               Modifier: "add",
//               Target: self,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
