import type { EventCard } from "@tcg/op-types";
import { op06Reject116I18n } from "./116-reject.i18n.ts";

export const op06Reject116: EventCard = {
  id: "OP06-116",
  canonicalId: "OP06-116",
  slug: "reject",
  name: "Reject",
  printings: [
    {
      id: "OP06-116",
      artId: "OP06-116",
      setCode: "OP06",
      collectorNumber: "116",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-116.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  trigger: "Draw 1 cards.",
  traits: ["Sky Island Shandian Warrior"],
  effect:
    "[Main] Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 5 or less.\n• If your opponent has 1 Life card, deal 1 damage to your opponent.\nThen, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "choice",
            options: [
              [
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
                        value: 5,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "dealDamage",
                  player: "opponent",
                  amount: 1,
                  condition: {
                    condition: "lifeCount",
                    player: "opponent",
                    comparison: "eq",
                    value: 1,
                  },
                },
              ],
            ],
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op06Reject116I18n,
};
