import type { ItemCard } from "@tcg/lorcana-types";
import { johnSmithsCompassI18n } from "./033-john-smiths-compass.i18n";

export const johnSmithsCompass: ItemCard = {
  id: "1U5",
  canonicalId: "ci_1U5",
  reprints: ["set11-033"],
  cardType: "item",
  name: "John Smith's Compass",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 33,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_09f9741601234011a2ea8ad45c845099",
    tcgPlayer: 674832,
  },
  text: [
    {
      title: "SPINNING ARROW",
      description:
        "At the end of your turn, if a character of yours challenged this turn, banish this item.",
    },
    {
      title: "YOUR PATH",
      description:
        "At the end of your turn, if none of your characters challenged this turn, reveal the top card of your deck. If it's a character card with cost 3 or less or named Pocahontas, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  abilities: [
    {
      id: "13c-1",
      name: "SPINNING ARROW",
      type: "triggered",
      condition: {
        type: "turn-metric",
        metric: "challenges-by-player",
        comparison: {
          operator: "gte",
          value: 1,
        },
        playerScope: "you",
      },
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        target: "THIS_ITEM",
        type: "banish",
      },
      text: "SPINNING ARROW At the end of your turn, if a character of yours challenged this turn, banish this item.",
    },
    {
      id: "13c-2",
      name: "YOUR PATH",
      type: "triggered",
      condition: {
        type: "turn-metric",
        metric: "challenges-by-player",
        comparison: {
          operator: "eq",
          value: 0,
        },
        playerScope: "you",
      },
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "or",
              filters: [
                {
                  type: "and",
                  filters: [
                    {
                      type: "card-type",
                      cardType: "character",
                    },
                    {
                      type: "cost-comparison",
                      comparison: "lte",
                      value: 3,
                    },
                  ],
                },
                {
                  type: "and",
                  filters: [
                    {
                      type: "card-type",
                      cardType: "character",
                    },
                    {
                      type: "name",
                      equals: "Pocahontas",
                    },
                  ],
                },
              ],
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      text: "YOUR PATH At the end of your turn, if none of your characters challenged this turn, reveal the top card of your deck. If it’s a character card with cost 3 or less or named Pocahontas, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  i18n: johnSmithsCompassI18n,
};
