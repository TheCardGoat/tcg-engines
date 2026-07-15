import type { LeaderCard } from "@tcg/op-types";
import { op02Zephyr072I18n } from "./072-zephyr.i18n.ts";

export const op02Zephyr072: LeaderCard = {
  id: "OP02-072",
  canonicalId: "OP02-072",
  slug: "zephyr/op02-072",
  name: "Zephyr",
  printings: [
    {
      id: "OP02-072",
      artId: "OP02-072",
      setCode: "OP02",
      collectorNumber: "072",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-072.jpg",
    },
    {
      id: "OP02-072_p1",
      artId: "OP02-072_p1",
      setCode: "OP02",
      collectorNumber: "072",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-072_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["purple", "black"],
  rarity: "L",
  setId: "OP02",
  power: 5000,
  life: 4,
  traits: ["Film Neo Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-072_p1.jpg",
      imageId: "OP02-072_p1",
    },
  ],
  effect:
    "[When Attacking] DON!! -4 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 3 or less. Then, this Leader gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 4,
          },
        ],
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
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02Zephyr072I18n,
};
