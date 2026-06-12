import type { CharacterCard } from "@tcg/lorcana-types";
import { pachaEmperorsGuideI18n } from "./143-pacha-emperors-guide.i18n";

export const pachaEmperorsGuide: CharacterCard = {
  id: "sLG",
  canonicalId: "ci_sLG",
  reprints: ["set5-143"],
  cardType: "character",
  name: "Pacha",
  version: "Emperor's Guide",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 143,
  rarity: "uncommon",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_761315af205f480fae3ecf8c5018db46",
    tcgPlayer: 561471,
  },
  text: [
    {
      title: "HELPFUL SUPPLIES",
      description: "At the start of your turn, if you have an item in play, gain 1 lore.",
    },
    {
      title: "PERFECT DIRECTIONS",
      description: "At the start of your turn, if you have a location in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "jdl-1",
      text: "HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain 1 lore.",
      name: "HELPFUL SUPPLIES",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      condition: {
        comparison: "greater-or-equal",
        controller: "you",
        count: 1,
        type: "has-item-count",
      },
    },
    {
      id: "jdl-2",
      text: "PERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain 1 lore.",
      name: "PERFECT DIRECTIONS",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      condition: {
        comparison: "greater-or-equal",
        controller: "you",
        count: 1,
        type: "has-location-count",
      },
    },
  ],
  i18n: pachaEmperorsGuideI18n,
};
