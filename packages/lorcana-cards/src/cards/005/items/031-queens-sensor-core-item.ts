// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// Import {
//   RevealTopOfDeckPutInHandOrDeck,
//   YouGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const queensSensorCoreItem: LorcanitoItemCard = {
//   Id: "rj3",
//   Name: "Queen's Sensor Core",
//   Characteristics: ["item"],
//   Text: "**SYMBOL OF NOBILITY** At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.\n**ROYAL SEARCH** {E}, 2 {I} – Reveal the top card of your deck. If it’s a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
//   Type: "item",
//   Abilities: [
//     AtTheStartOfYourTurn({
//       Name: "SYMBOL OF NOBILITY",
//       Text: "At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.",
//       ResolutionConditions: [
//         {
//           Type: "filter",
//           Comparison: { operator: "gte", value: 1 },
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             {
//               Filter: "characteristics",
//               Conjunction: "or",
//               Value: ["princess", "queen"],
//             },
//           ],
//         },
//       ],
//       Effects: [youGainLore(1)],
//     }),
//     {
//       Type: "activated",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       Name: "Royal Search",
//       Text: "{E}, 2 {I} – Reveal the top card of your deck. If it’s a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
//       Effects: revealTopOfDeckPutInHandOrDeck({
//         Mode: "top",
//         TutorFilters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             Filter: "characteristics",
//             Conjunction: "or",
//             Value: ["princess", "queen"],
//           },
//         ],
//       }),
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 2,
//   Lore: 1,
//   Illustrator: "Juan Diego Leon",
//   Number: 31,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 560914,
//   },
//   Rarity: "rare",
// };
//
