// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const heiheiBumblingRooster: LorcanitoCharacterCard = {
//   Id: "rmn",
//   Reprints: ["yeh"],
//   Name: "Heihei",
//   Title: "Bumbling Rooster",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**LET'S FATTEN YOU UP** When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Let's Fatten You Up",
//       Text: "When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
//       Optional: true,
//       Effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//       ResolutionConditions: [
//         {
//           Type: "filter",
//           Filters: [
//             { filter: "owner", value: "opponent" },
//             { filter: "zone", value: "inkwell" },
//           ],
//           Comparison: {
//             Operator: "gt",
//             Value: {
//               Dynamic: true,
//               Filters: [
//                 { filter: "owner", value: "self" },
//                 { filter: "zone", value: "inkwell" },
//               ],
//             },
//           },
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Anna Stoski",
//   Number: 75,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550576,
//   },
//   Rarity: "uncommon",
// };
//
