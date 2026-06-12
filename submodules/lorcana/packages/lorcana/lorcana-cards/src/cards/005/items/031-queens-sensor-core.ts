import type { ItemCard } from "@tcg/lorcana-types";
import { queensSensorCoreI18n } from "./031-queens-sensor-core.i18n";

export const queensSensorCore: ItemCard = {
  id: "Xs0",
  canonicalId: "ci_Xs0",
  reprints: ["set5-031"],
  cardType: "item",
  name: "Queen's Sensor Core",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 31,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a3736e115d014a5e85d5913b9d100f9e",
    tcgPlayer: 560914,
  },
  text: [
    {
      title: "SYMBOL OF NOBILITY",
      description:
        "At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.",
    },
    {
      title: "ROYAL SEARCH",
      description:
        "{E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
    },
  ],
  abilities: [
    {
      id: "1xk-1",
      name: "SYMBOL OF NOBILITY",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
        condition: {
          type: "or",
          conditions: [
            {
              type: "target-query",
              query: {
                selector: "all",
                owner: "you",
                zones: ["play"],
                cardType: "character",
                filters: [
                  {
                    type: "has-classification",
                    classification: "Princess",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            {
              type: "target-query",
              query: {
                selector: "all",
                owner: "you",
                zones: ["play"],
                cardType: "character",
                filters: [
                  {
                    type: "has-classification",
                    classification: "Queen",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
          ],
        },
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      text: "SYMBOL OF NOBILITY At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.",
    },
    {
      name: "ROYAL SEARCH",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        amount: 1,
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
                      type: "has-classification",
                      classification: "Princess",
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
                      type: "has-classification",
                      classification: "Queen",
                    },
                  ],
                },
              ],
            },
          },
          {
            zone: "deck-top",
            remainder: true,
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      id: "1xk-2",
      text: "ROYAL SEARCH {E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
      type: "activated",
    },
  ],
  i18n: queensSensorCoreI18n,
};
