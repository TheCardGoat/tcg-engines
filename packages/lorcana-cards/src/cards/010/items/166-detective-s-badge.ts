// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const detectivesBadge: LorcanitoItemCard = {
//   Id: "ha0",
//   Name: "Detective's Badge",
//   Characteristics: ["item"],
//   Text: "PROTECT AND SERVE {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn.",
//   Type: "item",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 1,
//   Illustrator: "Svetlozara Nikolova",
//   Number: 166,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 660340,
//   },
//   Rarity: "common",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "PROTECT AND SERVE",
//       Text: "{E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn.",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       Effects: [
//         ChosenCharacterGainsResist(1, "next_turn"),
//         {
//           Type: "characteristic",
//           Characteristics: ["detective"],
//           Modifier: "add",
//           Duration: "next_turn",
//           Until: true,
//           Target: chosenCharacter,
//         },
//       ],
//     },
//   ],
// };
//
