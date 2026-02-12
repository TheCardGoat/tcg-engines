// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   CardEffectTarget,
//   LorcanitoCharacterCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// Import {
//   ReturnCharacterFromDiscardToHand,
//   YouGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const targetPrincesInYourDiscard: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "discard" },
//     { filter: "owner", value: "self" },
//     { filter: "characteristics", value: ["princess"] },
//   ],
// };
//
// Const iveGotTheCoolestFriend: ResolutionAbility = {
//   Type: "resolution",
//   Name: "I'VE GOT THE COOLEST FRIEND",
//   Text: "When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
//   Effects: [
//     {
//       Type: "target-conditional",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: targetPrincesInYourDiscard,
//         },
//         YouGainLore(2),
//       ],
//       Fallback: [returnCharacterFromDiscardToHand],
//       Target: targetPrincesInYourDiscard,
//     },
//   ],
// };
//
// Export const wreckitRalphAdmiralUnderpants: LorcanitoCharacterCard = {
//   Id: "cso",
//   Name: "Wreck-It Ralph",
//   Title: "Admiral Underpants",
//   Characteristics: ["hero", "storyborn"],
//   Text: "**I’VE GOT THE COOLEST FRIEND** When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
//   Type: "character",
//   Abilities: [iveGotTheCoolestFriend],
//   Flavour: "If he must give a victory speech, he’ll keep it brief.",
//   Colors: ["amber"],
//   Cost: 7,
//   Strength: 6,
//   Willpower: 7,
//   Lore: 2,
//   Illustrator: "Hyuna Lee",
//   Number: 21,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 559783,
//   },
//   Rarity: "rare",
// };
//
