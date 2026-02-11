// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverOneOfYourCharactersSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const antonioMadrigalFriendToAll: LorcanitoCharacterCard = {
//   Id: "i29",
//   Name: "Antonio Madrigal",
//   Title: "Friend to All",
//   Characteristics: ["storyborn", "ally", "madrigal"],
//   Text: "OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
//   Type: "character",
//   Abilities: [
//     WheneverOneOfYourCharactersSings({
//       Name: "OF COURSE THEY CAN COME",
//       Text: "Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
//       Optional: true,
//       OncePerTurn: true,
//       Conditions: [duringYourTurn],
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           ShouldRevealMoved: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "deck" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 Comparison: {
//                   Operator: "lte",
//                   Value: 3,
//                 },
//               },
//             ],
//           },
//         },
//         {
//           Type: "shuffle-deck",
//           Target: self,
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber", "amethyst"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 2,
//   Illustrator: "Valerio Buonfantino",
//   Number: 5,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631703,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
