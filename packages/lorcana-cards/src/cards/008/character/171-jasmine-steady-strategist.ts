// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const jasmineSteadyStrategist: LorcanitoCharacterCard = {
//   Id: "om6",
//   Name: "Jasmine",
//   Title: "Steady Strategist",
//   Characteristics: ["floodborn", "hero", "princess"],
//   Text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jasmine.)\nALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(2, "Jasmine"),
//     WheneverThisCharacterQuests({
//       Name: "ALWAYS PLANNING",
//       Text: "Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "scry",
//           Amount: 3,
//           Mode: "bottom",
//           ShouldRevealTutored: true,
//           Target: self,
//           Limits: {
//             Bottom: 3,
//             Top: 0,
//             Inkwell: 0,
//             Hand: 1,
//           },
//           TutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             {
//               Filter: "characteristics",
//               Value: ["ally"],
//             },
//             { filter: "zone", value: "deck" },
//           ],
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire", "steel"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 5,
//   Illustrator: "Hedvig H.S",
//   Number: 171,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631467,
//   },
//   Rarity: "super_rare",
//   Lore: 1,
// };
//
