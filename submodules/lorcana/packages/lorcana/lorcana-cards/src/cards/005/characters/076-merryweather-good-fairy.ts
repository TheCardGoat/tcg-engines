import type { CharacterCard } from "@tcg/lorcana-types";
import { merryweatherGoodFairyI18n } from "./076-merryweather-good-fairy.i18n";

export const merryweatherGoodFairy: CharacterCard = {
  id: "463",
  canonicalId: "ci_463",
  reprints: ["set5-076"],
  cardType: "character",
  name: "Merryweather",
  version: "Good Fairy",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  cardNumber: 76,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c6e74eb559f2406fbea088388759a259",
    tcgPlayer: 559737,
  },
  text: [
    {
      title: "RAY OF HOPE",
      description:
        "When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            modifier: 2,
            stat: "strength",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "modify-stat",
          },
        },
        type: "optional",
      },
      id: "463-1",
      name: "RAY OF HOPE",
      text: "RAY OF HOPE When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: merryweatherGoodFairyI18n,
};
