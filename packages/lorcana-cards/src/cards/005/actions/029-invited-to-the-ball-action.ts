// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const invitedToTheBallAction: LorcanitoActionCard = {
//   Id: "lnv",
//   MissingTestCase: true,
//   Name: "Invited to the Ball",
//   Characteristics: ["action"],
//   Text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "scry",
//           Amount: 2,
//           Mode: "bottom",
//           ShouldRevealTutored: true,
//           Target: self,
//           Limits: {
//             Bottom: 2,
//             Inkwell: 0,
//             Top: 0,
//             Hand: 2,
//           },
//           TutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       ],
//     },
//   ],
//   Colors: ["amber"],
//   Cost: 2,
//   Illustrator: "Taraneh",
//   Number: 29,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 559086,
//   },
//   Rarity: "uncommon",
// };
//
