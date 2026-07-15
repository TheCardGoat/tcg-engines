// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const philoctetesNoNonsenseInstructor: LorcanitoCharacterCard = {
//   Id: "onn",
//   Reprints: ["g10"],
//   Name: "Philoctetes",
//   Title: "No-Nonsense Instructor",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**YOU GOTTA STAY FOCUSED** Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_\n\n\n**SHAMELESS PROMOTER** Whenever you play a Hero character, gain 1 lore.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "You Gotta Stay Focused",
//       Text: "Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_",
//       GainedAbility: challengerAbility(1),
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "characteristics", value: ["hero"] },
//         ],
//       },
//     },
//     {
//       Name: "Shameless Promoter",
//       Text: "Whenever you play a Hero character, gain 1 lore.",
//       ...wheneverTargetPlays({
//         TriggerFilter: [
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["hero"] },
//           { filter: "owner", value: "self" },
//         ],
//         Effects: [youGainLore(1)],
//       }),
//     },
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Stefano Spagnuolo",
//   Number: 190,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549463,
//   },
//   Rarity: "rare",
// };
//
