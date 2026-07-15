// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const lantern: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "ub2",
//   Reprints: ["aa1"],
//
//   Name: "Lantern",
//   Text: "**BIRTHDAY LIGHTS** {E} - You pay 1 {I} less for the next character you play this turn.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Birthday Lights",
//       Text: "{E} - You pay 1 {I} less for the next character you play this turn.",
//       Optional: false,
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "replacement",
//           Replacement: "cost",
//           Duration: "next",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "type", value: "character" }],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     "Lanterns fill the sky on one special night, beacons of hope and love.",
//   Colors: ["amber"],
//   Cost: 2,
//   Illustrator: "Eri Welli",
//   Number: 33,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493500,
//   },
//   Rarity: "rare",
// };
//
