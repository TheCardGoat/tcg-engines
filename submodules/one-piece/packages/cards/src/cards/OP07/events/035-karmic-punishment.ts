import type { EventCard } from "@tcg/op-types";
import { op07KarmicPunishment035I18n } from "./035-karmic-punishment.i18n.ts";

export const op07KarmicPunishment035: EventCard = {
  id: "OP07-035",
  canonicalId: "OP07-035",
  slug: "karmic-punishment",
  name: "Karmic Punishment",
  printings: [
    {
      id: "OP07-035",
      artId: "OP07-035",
      setCode: "OP07",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-035.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  traits: ["Fallen Monk Pirates Supernovas"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 3 or more Characters, that card gains an additional +1000 power during this battle. [Trigger] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisBattle",
            previousActionTargets: true,
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "gte",
              value: 3,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07KarmicPunishment035I18n,
};
