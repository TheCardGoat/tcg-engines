// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   WheneverChallengesAnotherChar,
//   WheneverPlays,
// } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mauiHalfshark: LorcanitoCharacterCard = {
//   Id: "th4",
//   Name: "Maui",
//   Title: "Half-Shark",
//   Characteristics: ["storyborn", "hero", "deity"],
//   Text: "Evasive (Only characters with Evasive can challenge this character.)\nCHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.\nWAYFINDING Whenever you play an action, gain 1 lore.",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     WheneverPlays({
//       Name: "Wayfinding",
//       Text: "Whenever you play an action, gain 1 lore.",
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       Effects: [youGainLore(1)],
//     }),
//     WheneverChallengesAnotherChar({
//       Name: "Cheeeohoooo!",
//       Text: "Whenever this character challenges another character, you may return an action card from your discard to your hand.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: ["action"] },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 6,
//   Strength: 7,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Alexandria Neonakis",
//   Number: 124,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 588357,
//   },
//   Rarity: "legendary",
// };
//
