import type { LeaderCard } from "@tcg/op-types";
import { op02MonkeyDGarp002I18n } from "./002-monkey-d-garp.i18n.ts";

export const op02MonkeyDGarp002: LeaderCard = {
  id: "OP02-002",
  cardType: "leader",
  color: ["red", "black"],
  rarity: "L",
  setId: "OP02",
  power: 5000,
  life: 4,
  traits: ["Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-002_p1.jpg",
      imageId: "OP02-002_p1",
    },
  ],
  effect:
    "[Your Turn] When this Leader or 1 of your Characters is given a DON!! card, give up to 1 of your opponent's Characters with a cost of 7 or less -1 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenDonGiven",
        conditions: [
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
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
            value: -1,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02MonkeyDGarp002I18n,
};
