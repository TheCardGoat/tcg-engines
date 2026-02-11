// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import {
//   TheyGainEvasive,
//   TheyGainReckless,
//   TheyGainRush,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mushuYourWorstNightmare: LorcanitoCharacterCard = {
//   Id: "eyj",
//   Name: "Mushu",
//   Title: "Your Worst Nightmare",
//   Characteristics: ["floodborn", "ally", "dragon"],
//   Text: "Shift 4\nALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn. ",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(4, "Mushu"),
//     WheneverTargetPlays({
//       Name: "ALL FIRED UP",
//       Text: "Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.",
//       ExcludeSelf: true,
//       TriggerFilter: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//       ],
//       Effects: [theyGainEvasive, theyGainRush, theyGainReckless],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby", "steel"],
//   Cost: 6,
//   Strength: 4,
//   Willpower: 6,
//   Illustrator: "Jared Mathews",
//   Number: 142,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631443,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
