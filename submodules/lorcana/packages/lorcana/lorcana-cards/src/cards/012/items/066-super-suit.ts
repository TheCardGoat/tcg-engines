import type { ItemCard } from "@tcg/lorcana-types";
import { superSuitI18n } from "./066-super-suit.i18n";

export const superSuit: ItemCard = {
  id: "yHW",
  canonicalId: "ci_yHW",
  reprints: ["set12-066"],
  cardType: "item",
  name: "Super Suit",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 66,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_65e90409854c4f69bd072e5eb971af8b",
  },
  text: [
    {
      title: "SIMPLE, ELEGANT",
      description: "When you play this item, if you have a Hero character in play, gain 1 lore.",
    },
    {
      title: "SUIT UP",
      description: "{E}, 2 {I} — If you played a Hero character this turn, draw a card.",
    },
  ],
  abilities: [
    {
      id: "yHW-1",
      name: "SIMPLE, ELEGANT",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-character-with-classification",
        classification: "Hero",
        controller: "you",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "SIMPLE, ELEGANT When you play this item, if you have a Hero character in play, gain 1 lore.",
    },
    {
      id: "yHW-2",
      name: "SUIT UP",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        comparison: {
          operator: "gte",
          value: 1,
        },
        classification: "Hero",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "SUIT UP {E}, 2 {I} — If you played a Hero character this turn, draw a card.",
    },
  ],
  i18n: superSuitI18n,
};
