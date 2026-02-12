// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   EvasiveAbility,
//   TargetCharacterGains,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const jiminyCricketLevelheadedAndWise: LorcanitoCharacterCard = {
//   Id: "rhn",
//   Name: "Jiminy Cricket",
//   Title: "Level-Headed and Wise",
//   Characteristics: ["storyborn", "mentor"],
//   Text: "Evasive\nENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     TargetCharacterGains({
//       Name: "ENOUGH'S ENOUGH",
//       Text: "While this character is exerted, opposing characters with Rush enter play exerted.",
//       Conditions: [
//         {
//           Type: "exerted",
//         },
//       ],
//       GainedAbility: entersPlayExerted({
//         Name: "ENOUGH'S ENOUGH",
//       }),
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "opponent" },
//           { filter: "ability", value: "rush" },
//           { filter: "zone", value: ["hand", "play"] },
//         ],
//       },
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 1,
//   Illustrator: "Rosa la Barbera / Livio Cacciatore",
//   Number: 62,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631392,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
