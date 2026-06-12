import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckRubyChampionI18n } from "./121-donald-duck-ruby-champion.i18n";

export const donaldDuckRubyChampion: CharacterCard = {
  id: "Yk1",
  canonicalId: "ci_Yk1",
  reprints: ["set10-121"],
  cardType: "character",
  name: "Donald Duck",
  version: "Ruby Champion",
  inkType: ["ruby"],
  set: "010",
  cardNumber: 121,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a9118586fa7c492bbe23ad34b60dcc57",
    tcgPlayer: 659629,
  },
  text: [
    {
      title: "HIGH ENERGY",
      description: "Your other Ruby characters get +1 {S}.",
    },
    {
      title: "POWERFUL REWARD",
      description: "Your other Ruby characters with 7 {S} or more get +1 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "Yk1-1",
      type: "static",
      name: "HIGH ENERGY",
      text: "HIGH ENERGY Your other Ruby characters get +1 {S}.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [
            {
              type: "ink-type",
              inkType: "ruby",
            },
          ],
        },
      },
    },
    {
      id: "Yk1-2",
      type: "static",
      name: "POWERFUL REWARD",
      text: "POWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 {L}.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [
            {
              type: "ink-type",
              inkType: "ruby",
            },
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 7,
            },
          ],
        },
      },
    },
  ],
  i18n: donaldDuckRubyChampionI18n,
};
