// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   BanishEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
//
// Export const beKingUndisputed: LorcanitoActionCard = {
//   Id: "o8o",
//   Reprints: ["vg8"],
//   Name: "Be King Undisputed",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nEach opponent chooses and banishes one of their characters.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Be King Undisputed",
//       Text: "Each opponent chooses and banishes one of their characters.",
//       Responder: "opponent",
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         } as BanishEffect,
//       ],
//     },
//   ],
//   Flavour: "Respected, saluted",
//   Colors: ["ruby"],
//   Cost: 4,
//   Illustrator: "Emily Abeydeera",
//   Number: 129,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547769,
//   },
//   Rarity: "rare",
// };
//
