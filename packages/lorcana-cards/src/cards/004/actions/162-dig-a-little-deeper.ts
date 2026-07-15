// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const digALittleDeeper: LorcanitoActionCard = {
//   Id: "vrj",
//   Reprints: ["pbu"],
//   MissingTestCase: true,
//   Name: "Dig A Little Deeper",
//   Characteristics: ["action", "song"],
//   Text: "**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_\n\n\nLook at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
//   Type: "action",
//   Abilities: [
//     SingerTogetherAbility(8),
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "scry",
//           Amount: 7,
//           Mode: "bottom",
//           ShouldRevealTutored: false,
//           Target: self,
//           Limits: {
//             Bottom: 5,
//             Inkwell: 0,
//             Hand: 2,
//             Top: 0,
//             Discard: 0,
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
//   Cost: 8,
//   Illustrator: "Rachel Elese",
//   Number: 162,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547842,
//   },
//   Rarity: "uncommon",
// };
//
