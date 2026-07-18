import type { LeaderCard } from "@tcg/op-types";
import { op02Smoker093I18n } from "./093-smoker.i18n.ts";

export const op02Smoker093: LeaderCard = {
  id: "OP02-093",
  canonicalId: "OP02-093",
  slug: "smoker/op02-093",
  name: "Smoker",
  printings: [
    {
      id: "OP02-093",
      artId: "OP02-093",
      setCode: "OP02",
      collectorNumber: "093",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-093.jpg",
    },
    {
      id: "OP02-093_p1",
      artId: "OP02-093_p1",
      setCode: "OP02",
      collectorNumber: "093",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-093_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "OP02",
  power: 5000,
  life: 5,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-093_p1.jpg",
      imageId: "OP02-093_p1",
    },
  ],
  effect:
    "[DON!! x1] [Activate:Main] [Once Per Turn] Give up to 1 of your opponent's Characters -1 cost during this turn. Then, if there is a Character with a cost of 0, this Leader gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: { amount: 1 },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
            condition: {
              condition: "compound",
              operator: "or",
              conditions: [
                {
                  condition: "existsOnField",
                  player: "self",
                  zone: "character",
                  filters: [{ filter: "cost", comparison: "eq", value: 0 }],
                },
                {
                  condition: "existsOnField",
                  player: "opponent",
                  zone: "character",
                  filters: [{ filter: "cost", comparison: "eq", value: 0 }],
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op02Smoker093I18n,
};
