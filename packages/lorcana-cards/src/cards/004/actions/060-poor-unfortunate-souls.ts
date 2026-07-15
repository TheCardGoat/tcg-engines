// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { withCostXorLess } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const poorUnfortunateSouls: LorcanitoActionCard = {
//   Id: "d2i",
//   Reprints: ["k1n"],
//   Name: "Poor Unfortunate Souls",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\n\nReturn a character, item or location with cost 2 or less to their player's hand.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: ["character", "location", "item"] },
//               { filter: "zone", value: "play" },
//               WithCostXorLess(2),
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "It's sad but true",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 2,
//   Illustrator: "Denny Minonne",
//   Number: 60,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550518,
//   },
//   Rarity: "common",
// };
//
