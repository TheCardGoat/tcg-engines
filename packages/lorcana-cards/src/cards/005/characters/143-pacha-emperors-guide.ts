import type { CharacterCard } from "@tcg/lorcana-types";

export const pachaEmperorsGuide: CharacterCard = {
  abilities: [
    {
      condition: {
        type: "has-item-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "jdl-1",
      name: "HELPFUL SUPPLIES",
      text: "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain 1 lore.",
      trigger: {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      },
      type: "triggered",
    },
    {
      condition: {
        type: "has-location-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
      },
      effect: {
        type: "gain-lore",
        amount: 0,
      },
      id: "jdl-2",
      name: "PERFECT DIRECTIONS",
      text: "PERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain {d} lore.",
      trigger: {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      },
      type: "triggered",
    },
  ],
  cardNumber: 143,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "45d674f51882c26ab667fbf028052879b9c0941d",
  },
  franchise: "Emperors New Groove",
  fullName: "Pacha - Emperor's Guide",
  id: "jdl",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Pacha",
  set: "005",
  strength: 0,
  text: "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain 1 lore.\nPERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain 1 lore.",
  version: "Emperor's Guide",
  willpower: 4,
};
