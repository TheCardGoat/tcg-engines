// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const ursulaShellNecklace: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "nba",
//   Reprints: ["nm0"],
//   Name: "Ursula's Shell Necklace",
//   Text: "**NOW, SING!** Whenever you play a song, you may pay 1 {I} to draw a card.",
//   Type: "item",
//   Abilities: [
//     WheneverPlays({
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["song"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       Costs: [{ type: "ink", amount: 1 }],
//       Optional: true,
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "Singing is a lovely pastime . . . if you've got the voice for it. −Ursula",
//   Colors: ["amber"],
//   Cost: 3,
//   Illustrator: "Jenna Gray",
//   Number: 34,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 504692,
//   },
//   Rarity: "rare",
// };
//
