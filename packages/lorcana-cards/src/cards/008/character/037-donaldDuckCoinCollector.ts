// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ResolutionAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
// Import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const gainAbilityEffect: AbilityEffect = {
//   Type: "ability",
//   Ability: "custom",
//   Modifier: "add",
//   Duration: "turn",
//   Target: yourCharacters,
//   CustomAbility: {
//     Type: "activated",
//     Costs: [{ type: "exert" }],
//     Name: "MONEY EVERYWHERE",
//     Text: "{E} – Draw a card.",
//     Effects: [drawACard],
//   },
// };
//
// Export const moneyEverywhere: ResolutionAbility = {
//   Type: "resolution",
//   Name: "MONEY EVERYWHERE",
//   Text: 'When you play this character, your other characters gain "{E} – Draw a card" this turn.',
//   Effects: [gainAbilityEffect],
// };
//
// Const herePiggyPiggy = whenYouPlayThisForEachYouPayLess({
//   Name: "HERE, PIGGY, PIGGY",
//   Text: "For each item named The Nephews' Piggy Bank you have in play, you pay 2 {I} less to play this character.",
//   Amount: {
//     Dynamic: true,
//     FilterMultiplier: 2,
//     Filters: [
//       { filter: "owner", value: "self" },
//       { filter: "zone", value: "play" },
//       {
//         Filter: "attribute",
//         Value: "name",
//         Comparison: {
//           Operator: "eq",
//           Value: "The Nephews' Piggy Bank",
//         },
//       },
//     ],
//   },
// });
//
// Export const donaldDuckCoinCollector: LorcanitoCharacterCard = {
//   Id: "ojz",
//   Name: "Donald Duck",
//   Title: "Coin Collector",
//   Characteristics: ["storyborn", "hero"],
//   Text: 'HERE, PIGGY, PIGGY For each item named The Nephews\' Piggy Bank you have in play, you pay 2 {I} less to play this character.\nMONEY EVERYWHERE When you play this character, your other characters gain "{E} – Draw a card" this turn.',
//   Type: "character",
//   Abilities: [herePiggyPiggy, moneyEverywhere],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 8,
//   Strength: 4,
//   Willpower: 8,
//   Illustrator: "Rianit Hidayat",
//   Number: 37,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631334,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
