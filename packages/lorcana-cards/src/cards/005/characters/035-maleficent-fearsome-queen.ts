// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const maleficentFearsomeQueen: LorcanitoCharacterCard = {
//   Id: "ffi",
//   MissingTestCase: true,
//   Name: "Maleficent",
//   Title: "Formidable Queen",
//   Characteristics: ["floodborn", "queen", "sorcerer", "villain"],
//   Text: "**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Maleficent.)_\n \n**EVERYONE LISTEN** When you play this character, for each character named Maleficent you have in play, return chosen opposing character, item, or location of cost 3 or less to their player's hand.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(6, "Maleficent"),
//     {
//       Type: "resolution",
//       Name: "Everyone Listen",
//       Text: "When you play this character, for each character named Maleficent you have in play, return chosen opposing character, item, or location of cost 3 or less to their player's hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "opponent" },
//               { filter: "zone", value: "play" },
//               { filter: "type", value: ["character", "item", "location"] },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 Comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Colors: ["amethyst"],
//   Cost: 8,
//   Strength: 7,
//   Willpower: 7,
//   Lore: 2,
//   Illustrator: "Malia Ewart",
//   Number: 35,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 561950,
//   },
//   Rarity: "super_rare",
// };
//
