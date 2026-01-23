import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsLeadDetective: CharacterCard = {
  id: "1c8",
  cardType: "character",
  name: "Judy Hopps",
  version: "Lead Detective",
  fullName: "Judy Hopps - Lead Detective",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Judy Hopps.)\nLATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2. (They can challenge as if they had Evasive. Damage dealt to them is reduced by 2.)",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  cardNumber: 150,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ade526b78f2bf4c97b7a035fe806854320c80e92",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   alertAbility,
//   type GainAbilityStaticAbility,
//   resistAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
//
// const lateralThinkingAlert: GainAbilityStaticAbility = {
//   type: "static",
//   ability: "gain-ability",
//   name: "LATERAL THINKING",
//   text: "During your turn, your Detective characters gain Alert. (They can challenge as if they had Evasive.)",
//   gainedAbility: alertAbility,
//   conditions: [duringYourTurn],
//   target: {
//     type: "card",
//     value: "all",
//     filters: [
//       { filter: "zone", value: "play" },
//       { filter: "type", value: "character" },
//       { filter: "owner", value: "self" },
//       { filter: "characteristics", value: ["detective"] },
//     ],
//   },
// };
// const lateralThinkingResist: GainAbilityStaticAbility = {
//   type: "static",
//   ability: "gain-ability",
//   name: "LATERAL THINKING",
//   text: "During your turn, your Detective characters gain Resist +2. (Damage dealt to them is reduced by 2.)",
//   gainedAbility: resistAbility(2),
//   conditions: [duringYourTurn],
//   target: {
//     type: "card",
//     value: "all",
//     filters: [
//       { filter: "zone", value: "play" },
//       { filter: "type", value: "character" },
//       { filter: "owner", value: "self" },
//       { filter: "characteristics", value: ["detective"] },
//     ],
//   },
// };
// export const judyHoppsLeadDetective: LorcanitoCharacterCard = {
//   id: "jb0",
//   name: "Judy Hopps",
//   title: "Lead Detective",
//   characteristics: ["floodborn", "hero", "detective"],
//   text: "Shift 4 {I}\n\nLATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 6,
//   willpower: 4,
//   illustrator: "Kurokuma",
//   number: 150,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658869,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     shiftAbility(4, "Judy Hopps"),
//     lateralThinkingAlert,
//     lateralThinkingResist,
//   ],
// };
//
