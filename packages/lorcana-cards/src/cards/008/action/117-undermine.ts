// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const undermine: LorcanitoActionCard = {
//   Id: "hbl",
//   MissingTestCase: true,
//   Name: "Undermine",
//   Characteristics: ["action"],
//   Text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["emerald", "ruby"],
//   Cost: 2,
//   Illustrator: "Luigi Aimè",
//   Number: 117,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631426,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     {
//       Type: "resolution",
//       Optional: false,
//       Responder: "opponent",
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       Type: "resolution",
//       Effects: [chosenCharacterGetsStrength(2)],
//     },
//   ],
// };
//
