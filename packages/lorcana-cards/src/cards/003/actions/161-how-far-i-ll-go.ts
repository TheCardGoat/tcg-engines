// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const howFarIllGo: LorcanitoActionCard = {
//   Id: "x7c",
//   Name: "How Far I'll Go",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nLook at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
//       Effects: [
//         {
//           Type: "scry",
//           Amount: 2,
//           Mode: "inkwell",
//           ShouldRevealTutored: false,
//           Target: self,
//           Limits: {
//             Bottom: 0,
//             Top: 0,
//             Hand: 1,
//             Inkwell: 1,
//           },
//           TutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//           ],
//         },
//       ],
//     },
//   ],
//   Colors: ["sapphire"],
//   Cost: 4,
//   Illustrator: "Anna Rud / Anna Stosik",
//   Number: 161,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 539102,
//   },
//   Rarity: "uncommon",
// };
//
