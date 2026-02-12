// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { Effect, LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Function getEffects(value: "self" | "opponent" | "all"): Effect[] {
//   Return [
//     {
//       Type: "discard",
//       Amount: 60,
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "zone", value: "hand" },
//           Value === "all"
//             ? { filter: "zone", value: "hand" }
//             : { filter: "owner", value: value },
//         ],
//       },
//     },
//     {
//       Type: "draw",
//       Amount: 3,
//       Target: {
//         Type: "player",
//         Value: value,
//       },
//     },
//   ];
// }
//
// Export const beyondTheHorizon: LorcanitoActionCard = {
//   Id: "yv0",
//   Name: "Beyond The Horizon",
//   Characteristics: ["action", "song"],
//   Text: "Sing Together 7\nChoose any number of players. They discard their hands and draw 3 cards each.",
//   Type: "action",
//   Abilities: [
//     SingerTogetherAbility(7),
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
//               Text: "Both Players Discard their Hands and Draw 3 Cards",
//               Effects: getEffects("all"),
//             },
//             {
//               Id: "2",
//               Text: "You discard your hand and draw 3 cards",
//               Effects: getEffects("self"),
//             },
//             {
//               Id: "3",
//               Text: "Your opponent discards their hand and draws 3 cards",
//               Effects: getEffects("opponent"),
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 7,
//   Illustrator: "Taranah",
//   Number: 202,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631483,
//   },
//   Rarity: "uncommon",
// };
//
