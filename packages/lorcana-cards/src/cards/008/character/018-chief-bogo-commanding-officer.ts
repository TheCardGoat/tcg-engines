// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { duringOpponentsTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { wheneverOneOfYouCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const chiefBogoCommandingOfficer: LorcanitoCharacterCard = {
//   Id: "g07",
//   Name: "Chief Bogo",
//   Title: "Commanding Officer",
//   Characteristics: ["storyborn"],
//   Text: "SENDING BACKUP During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 5,
//   Illustrator: "Nicola Savioli",
//   Number: 18,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631362,
//   },
//   Rarity: "legendary",
//   Lore: 1,
//   Abilities: [
//     WheneverOneOfYouCharactersIsBanished({
//       Name: "SENDING BACKUP",
//       Text: "During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
//       Optional: true,
//       Conditions: [duringOpponentsTurn],
//       TriggerTarget: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "ability", value: "bodyguard" },
//       ],
//       Effects: [
//         {
//           Type: "reveal-and-play",
//           PutInto: "deck",
//           Exerted: false,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 Comparison: { operator: "lte", value: 5 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
