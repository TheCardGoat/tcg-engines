// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// Import {
//   OpponentLoseLore,
//   YouGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const lefouCakeThief: LorcanitoCharacterCard = {
//   Id: "ka1",
//   Name: "LeFou",
//   Title: "Cake Thief",
//   Characteristics: ["storyborn", "ally"],
//   Text: "ALL FOR ME {E}, banish one of your items – Chosen opponent loses 1 lore and you gain 1 lore.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "ALL FOR ME",
//       Text: "{E}, banish one of your items – Chosen opponent loses 1 lore and you gain 1 lore.",
//       Costs: [
//         { type: "exert" },
//         {
//           Type: "card",
//           Action: "banish",
//           Amount: 1,
//           Filters: chosenItemOfYours.filters,
//         },
//       ],
//       Effects: [opponentLoseLore(1), youGainLore(1)],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["ruby", "sapphire"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Illustrator: "Simone Buonfantino",
//   Number: 138,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631440,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
