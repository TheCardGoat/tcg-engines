import type { CharacterCard } from "@tcg/lorcana-types";

export const pachaEmperorsGuide: CharacterCard = {
  id: "jdl",
  cardType: "character",
  name: "Pacha",
  version: "Emperor's Guide",
  fullName: "Pacha - Emperor's Guide",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain 1 lore.\nPERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain 1 lore.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 143,
  inkable: true,
  externalIds: {
    ravensburger: "45d674f51882c26ab667fbf028052879b9c0941d",
  },
  abilities: [
    {
      id: "jdl-1",
      text: "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain 1 lore.",
      name: "HELPFUL SUPPLIES",
      type: "triggered",
      trigger: {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      condition: {
        type: "has-item-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
      },
    },
    {
      id: "jdl-2",
      text: "PERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain {d} lore.",
      name: "PERFECT DIRECTIONS",
      type: "triggered",
      trigger: {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      },
      effect: {
        type: "gain-lore",
        amount: 0,
      },
      condition: {
        type: "has-location-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
      },
    },
  ],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import {
//   youHaveItemInPlay,
//   youHaveLocationInPlay,
// } from "@lorcanito/lorcana-engine/abilities/conditions";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const pachaEmperorsGuide: LorcanitoCharacterCard = {
//   id: "jw7",
//   missingTestCase: true,
//   name: "Pacha",
//   title: "Emperor's Guide",
//   characteristics: ["hero", "storyborn"],
//   text: "**HELPFUL SUPPLIES** At the start of your turn, if you have an item in play, gain 1 lore. **PERFECT DIRECTIONS** At the start of your turn, if you have a location in play, gain 1 lore.",
//   type: "character",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "Helpful Supplies",
//       text: "At the start of your turn, if you have an item in play, gain 1 lore.",
//       resolutionConditions: [youHaveItemInPlay],
//       effects: [youGainLore(1)],
//     }),
//     atTheStartOfYourTurn({
//       name: "Perfect Directions",
//       text: "At the start of your turn, if you have a location in play, gain 1 lore.",
//       resolutionConditions: [youHaveLocationInPlay],
//       effects: [youGainLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   willpower: 4,
//   strength: 0,
//   lore: 2,
//   illustrator: "Alex Accorsi",
//   number: 143,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561471,
//   },
//   rarity: "uncommon",
// };
//
