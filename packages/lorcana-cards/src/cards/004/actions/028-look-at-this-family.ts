// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const lookAtThisFamily: LorcanitoActionCard = {
//   Id: "hgt",
//   Reprints: ["h6u"],
//   MissingTestCase: true,
//   Name: "Look At This Family",
//   Characteristics: ["action", "song"],
//   Text: "**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_\n\n\nLook at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
//   Type: "action",
//   Abilities: [
//     SingerTogetherAbility(7),
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "scry",
//           Amount: 5,
//           Mode: "bottom",
//           ShouldRevealTutored: true,
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
//             { filter: "type", value: "character" },
//           ],
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 7,
//   Illustrator: "Giulia Riva",
//   Number: 28,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547845,
//   },
//   Rarity: "rare",
// };
//
