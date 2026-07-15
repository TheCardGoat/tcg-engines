// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const doloresMadrigalEasyListener: LorcanitoCharacterCard = {
//   Id: "ytb",
//   Reprints: ["yvi"],
//   MissingTestCase: true,
//   Name: "Dolores Madrigal",
//   Title: "Easy Listener",
//   Characteristics: ["storyborn", "ally", "madrigal"],
//   Text: "**MAGICAL INFORMANT** When you play this character, if an opponent has an exerted character in play, you may draw a card.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "**MAGICAL INFORMANT**",
//       Text: "When you play this character, if an opponent has an exerted character in play, you may draw a card.",
//       ResolutionConditions: [
//         {
//           Type: "filter",
//           Comparison: { operator: "gte", value: 1 },
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "opponent" },
//             {
//               Filter: "status",
//               Value: "exerted",
//             },
//           ],
//         },
//       ],
//       Optional: true,
//       Effects: [drawACard],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Otto Perdes",
//   Number: 41,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 543900,
//   },
//   Rarity: "common",
// };
//
