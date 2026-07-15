// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { targetCardGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const hamsterBall: LorcanitoItemCard = {
//   Id: "oq5",
//   Name: "Hamster Ball",
//   Characteristics: ["item"],
//   Text: "ROLL WITH THE PUNCHES {E}, 1 {I} – Chosen character with no damage gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
//   Type: "item",
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 3,
//   Illustrator: "Alex Accorsi",
//   Number: 204,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631485,
//   },
//   Rarity: "common",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "ROLL WITH THE PUNCHES",
//       Text: "{E}, 1 {I} – Chosen character with no damage gains Resist +2 until the start of your next turn.",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       Effects: [
//         TargetCardGainsResist({
//           Amount: 2,
//           Duration: "next_turn",
//           Target: {
//             ...chosenCharacter,
//             Filters: [
//               ...chosenCharacter.filters,
//               { filter: "status", value: "damaged", negate: true },
//             ],
//           },
//         }),
//       ],
//     },
//   ],
// };
//
