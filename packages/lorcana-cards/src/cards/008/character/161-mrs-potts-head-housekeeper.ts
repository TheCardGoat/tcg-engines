// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mrsPottsHeadHousekeeper: LorcanitoCharacterCard = {
//   Id: "wue",
//   Name: "Mrs. Potts",
//   Title: "Head Housekeeper",
//   Characteristics: ["storyborn", "ally"],
//   Text: "CLEAN UP {E}, Banish one of your items – Draw a card.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "CLEAN UP",
//       Text: "{E}, Banish one of your items – Draw a card.",
//       Costs: [{ type: "exert" }],
//       ResolveEffectsIndividually: true,
//       DependentEffects: true,
//       Effects: [
//         DrawACard,
//         {
//           Type: "banish",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 4,
//   Illustrator: "Julie Vu",
//   Number: 161,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631458,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
