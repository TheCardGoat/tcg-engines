import type { LeaderCard } from "@tcg/op-types";
import { op04Issho020I18n } from "./020-issho.i18n.ts";

export const op04Issho020: LeaderCard = {
  id: "OP04-020",
  canonicalId: "OP04-020",
  slug: "issho/op04-020",
  name: "Issho",
  printings: [
    {
      id: "OP04-020",
      artId: "OP04-020",
      setCode: "OP04",
      collectorNumber: "020",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-020.jpg",
    },
    {
      id: "OP04-020_p1",
      artId: "OP04-020_p1",
      setCode: "OP04",
      collectorNumber: "020",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-020_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["green", "black"],
  rarity: "L",
  setId: "OP04",
  power: 5000,
  life: 4,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-020_p1.jpg",
      imageId: "OP04-020_p1",
    },
  ],
  effect:
    "[DON!! x1] [Your Turn] Give all of your opponent's Characters -1 cost. [End of Your Turn] (1) (You may rest the specified number of DON!! cards in your cost area.): Set up to 1 of your Characters with a cost of 5 or less as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -1,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op04Issho020I18n,
};
