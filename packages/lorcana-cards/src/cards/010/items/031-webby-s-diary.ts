// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const webbysDiary: LorcanitoItemCard = {
//   Id: "tj4",
//   Name: "Webby's Diary",
//   Characteristics: ["item"],
//   Text: "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
//   Type: "item",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 3,
//   Illustrator: "Julie Vu",
//   Number: 31,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 658789,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     {
//       Type: "static-triggered",
//       Trigger: {
//         On: "put-a-card-under",
//         Target: {
//           Type: "card",
//           Value: "all",
//           Filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: ["character", "location"] },
//             { filter: "zone", value: "play" },
//           ],
//         },
//       },
//       Name: "LATEST ENTRY",
//       Text: "Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
//       Layer: {
//         Type: "resolution",
//         Optional: true,
//         Name: "LATEST ENTRY",
//         Text: "you may pay 1 {I} to draw a card.",
//         Effects: [drawACard],
//         Costs: [{ type: "ink", amount: 1 }],
//       },
//     },
//   ],
// };
//
