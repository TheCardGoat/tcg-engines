// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// import { atEndOfTurnBanishItself } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   chosenYourCharacterGetsStrength,
//   drawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// const gainAbilityEffect: AbilityEffect = {
//   type: "ability",
//   ability: "custom",
//   modifier: "add",
//   duration: "turn",
//   customAbility: atEndOfTurnBanishItself,
//   target: {
//     type: "card",
//     value: "all",
//     filters: [{ filter: "source", value: "target" }],
//   },
// };
//
// const dependentAbilities: ResolutionAbility = {
//   type: "resolution",
//   effects: [chosenYourCharacterGetsStrength(5), gainAbilityEffect],
//   dependentEffects: true,
// };
//
// export const candyDrift: LorcanitoActionCard = {
//   id: "sf4",
//   name: "Candy Drift",
//   characteristics: ["action"],
//   text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
//   type: "action",
//   inkwell: true,
//   colors: ["amber", "ruby"],
//   cost: 2,
//   illustrator: "Stefano Spagnuolo",
//   number: 39,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631377,
//   },
//   rarity: "uncommon",
//   abilities: [{ type: "resolution", effects: [drawACard] }, dependentAbilities],
// };
//
