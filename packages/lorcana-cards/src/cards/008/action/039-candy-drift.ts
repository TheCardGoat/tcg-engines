// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   AbilityEffect,
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// Import { atEndOfTurnBanishItself } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   ChosenYourCharacterGetsStrength,
//   DrawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const gainAbilityEffect: AbilityEffect = {
//   Type: "ability",
//   Ability: "custom",
//   Modifier: "add",
//   Duration: "turn",
//   CustomAbility: atEndOfTurnBanishItself,
//   Target: {
//     Type: "card",
//     Value: "all",
//     Filters: [{ filter: "source", value: "target" }],
//   },
// };
//
// Const dependentAbilities: ResolutionAbility = {
//   Type: "resolution",
//   Effects: [chosenYourCharacterGetsStrength(5), gainAbilityEffect],
//   DependentEffects: true,
// };
//
// Export const candyDrift: LorcanitoActionCard = {
//   Id: "sf4",
//   Name: "Candy Drift",
//   Characteristics: ["action"],
//   Text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["amber", "ruby"],
//   Cost: 2,
//   Illustrator: "Stefano Spagnuolo",
//   Number: 39,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631377,
//   },
//   Rarity: "uncommon",
//   Abilities: [{ type: "resolution", effects: [drawACard] }, dependentAbilities],
// };
//
