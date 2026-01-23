import type { ActionCard } from "@tcg/lorcana-types";

export const nextStopOlympus: ActionCard = {
  id: "xl2",
  cardType: "action",
  name: "Next Stop, Olympus",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  text: "ACTION If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.\nReady chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
  cost: 2,
  cardNumber: 129,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "790b03a85acbeacfa6e0cdce19e8aa611d38f18b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// const characterWith5orMoreStr: Condition = {
//   type: "filter",
//   comparison: { operator: "gte", value: 1 },
//   filters: [
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     {
//       filter: "attribute",
//       value: "strength",
//       comparison: { operator: "gte", value: 5 },
//     },
//   ],
// };
//
// const gainAbilityEffect: AbilityEffect = {
//   type: "ability",
//   ability: "custom",
//   modifier: "add",
//   duration: "challenge",
//   times: 1,
//   target: chosenCharacter,
//   customAbility: wheneverChallengesAnotherChar({
//     name: "The next time they challenge another character this turn, gain 1 lore.",
//     effects: [youGainLore(1)],
//   }),
// };
//
// export const nextStopOlympus: LorcanitoActionCard = {
//   id: "ife",
//   name: "Next Stop, Olympus",
//   characteristics: ["action"],
//   text: "If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action. Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
//   type: "action",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Simone Buonfantino",
//   number: 129,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658326,
//   },
//   rarity: "rare",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "Cost Reduction",
//       text: "If you have a character with 5 or more in play, you pay 2 less to play this action.",
//       amount: 2,
//       conditions: [characterWith5orMoreStr],
//     }),
//     {
//       type: "resolution",
//       resolveEffectsIndividually: false,
//       dependentEffects: false,
//       text: "Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: chosenCharacter,
//         },
//         {
//           type: "restriction",
//           restriction: "quest",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//         gainAbilityEffect,
//       ],
//     },
//   ],
// };
//
