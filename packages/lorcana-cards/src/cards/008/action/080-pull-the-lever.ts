// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const pullTheLever: LorcanitoActionCard = {
//   Id: "sp7",
//   Name: "Pull The Lever!",
//   Characteristics: ["action"],
//   Text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["amethyst", "emerald"],
//   Cost: 3,
//   Illustrator: "Mario Manzanares",
//   Number: 80,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631402,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "modal",
//           // TODO: Get rid of target
//           Target: chosenCharacter,
//           Modes: [
//             {
//               Id: "1",
//               Text: "Draw 2 cards.",
//               Effects: [drawXCards(2)],
//             },
//             {
//               Id: "2",
//               Text: "Each opponent chooses and discards a card.",
//               Responder: "opponent",
//               Effects: [
//                 {
//                   Type: "discard",
//                   Amount: 1,
//                   Target: {
//                     Type: "card",
//                     Value: 1,
//                     Filters: [
//                       { filter: "zone", value: "hand" },
//                       { filter: "owner", value: "self" },
//                     ],
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
