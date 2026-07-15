// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// Import {
//   YouPayXLessToPlayNextActionThisTurn,
//   YouPayXLessToPlayNextItemThisTurn,
//   YouPayXLessToPlayNextLocationThisTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const scroogesTopHat: LorcanitoItemCard = {
//   Id: "jzq",
//   MissingTestCase: true,
//   Name: "Scrooge's Top Hat",
//   Characteristics: ["item"],
//   Text: "**BUSINESS EXPERTISE** {E} – Choose one: You pay 1 {I} less to play your next action this turn. You pay 1 {I} less to play your next item this turn. You pay 1 {I} less to play your next location this turn.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "PENNY PINCHER",
//       Text: "{E} – Choose one: You pay 1 {I} less to play your next action this turn. You pay 1 {I} less to play your next item this turn. You pay 1 {I} less to play your next location this turn.",
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "modal",
//           Target: chosenCharacter,
//           Modes: [
//             {
//               Id: "1",
//               Text: "You pay 1 {I} less to play your next action this turn.",
//               Effects: [youPayXLessToPlayNextActionThisTurn(1)],
//             },
//             {
//               Id: "2",
//               Text: "You pay 1 {I} less to play your next item this turn.",
//               Effects: [youPayXLessToPlayNextItemThisTurn(1)],
//             },
//             {
//               Id: "3",
//               Text: "You pay 1 {I} less to play your next location this turn.",
//               Effects: [youPayXLessToPlayNextLocationThisTurn(1)],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   Flavour: "Just the thing to top off another brilliant deal.",
//   Colors: ["sapphire"],
//   Cost: 2,
//   Illustrator: "Gabriel Angelo",
//   Number: 166,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 537623,
//   },
//   Rarity: "uncommon",
// };
//
