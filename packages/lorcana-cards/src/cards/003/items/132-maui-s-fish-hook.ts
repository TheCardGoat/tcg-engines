// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// Export const mauisFishHook: LorcanitoItemCard = {
//   Id: "ya5",
//   Name: "Maui's Fish Hook",
//   Characteristics: ["item"],
//   Text: "**IT'S MAUI TIME!** If you have a character named Maui in play, you may use this item's Shapeshift ability for free.\n\n\n**SHAPESHIFT** {E}, 2 {I} – Choose one:\n\n· Chosen character gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_\n\n· Chosen character gets +3 {S} this turn.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Shapeshift",
//       Text: "{E}, 2 {I} – Choose one: Chosen character gains **Evasive** until the start of your next turn. Chosen character gets +3 {S} this turn.",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       Effects: [
//         {
//           Type: "modal",
//           // TODO: Get rid of target
//           Target: chosenCharacter,
//           Modes: [
//             {
//               Id: "1",
//               Text: "Chosen character gains **Evasive** until the start of your next turn.",
//               Effects: [
//                 {
//                   Type: "ability",
//                   Ability: "evasive",
//                   Modifier: "add",
//                   Duration: "next_turn",
//                   Until: true,
//                   Target: chosenCharacter,
//                 },
//               ],
//             },
//             {
//               Id: "2",
//               Text: "Chosen character gets +3 {S} this turn.",
//               Effects: [
//                 {
//                   Type: "attribute",
//                   Attribute: "strength",
//                   Amount: 3,
//                   Modifier: "add",
//                   Duration: "turn",
//                   Target: chosenCharacter,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 3,
//   Illustrator: "Peter Brockhammer",
//   Number: 132,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 538333,
//   },
//   Rarity: "rare",
// };
//
