import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianBadmintonAce: CharacterCard = {
  id: "6at",
  cardType: "character",
  name: "Maid Marian",
  version: "Badminton Ace",
  fullName: "Maid Marian - Badminton Ace",
  inkType: ["sapphire", "steel"],
  franchise: "Robin Hood",
  set: "007",
  text: "GOOD SHOT During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.\nFAIR PLAY Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 176,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "16b563305b1ebac09f45ac449c05181244aff0e5",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   type ResolutionAbility,
//   resistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringOpponentsTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import type { DamageTrigger } from "@lorcanito/lorcana-engine/abilities/triggers";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { dealDamageToChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const maidMarianBadmintonAce: LorcanitoCharacterCard = {
//   id: "wjz",
//   name: "Maid Marian",
//   title: "Badminton Ace",
//   characteristics: ["dreamborn", "hero", "princess"],
//   text: "GOOD SHOT During an opponent’s turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.\nFAIR PLAY Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   abilities: [
//     {
//       type: "static-triggered",
//       optional: false,
//       name: "Good Shot",
//       text: "During an opponent’s turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.",
//       conditions: [duringOpponentsTurn],
//       trigger: {
//         on: "damage",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["ally"] },
//         ],
//       } as DamageTrigger,
//       layer: {
//         type: "resolution",
//         name: "Good Shot",
//         text: "During an opponent’s turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.",
//         optional: false,
//         effects: [dealDamageToChosenOpposingCharacter(1)],
//       } as ResolutionAbility, // Something funky going on with TS
//     },
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Fair Play",
//       text: "Your characters named Lady Kluck gain Resist +1.",
//       gainedAbility: resistAbility(1),
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "Lady Kluck" },
//           },
//         ],
//       },
//     },
//   ],
//   inkwell: true,
//
//   colors: ["sapphire", "steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Emily Abdyedera",
//   number: 176,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619508,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
