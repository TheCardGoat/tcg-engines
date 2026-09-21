import type { EventCard } from "@tcg/op-types";
import { op15WouldYouLetMeEatTheFlameFlameFruit056I18n } from "./op15-056-would-you-let-me-eat-the-flame-flame-fruit.i18n.ts";

export const op15WouldYouLetMeEatTheFlameFlameFruit056: EventCard = {
  id: "OP15-056",
  canonicalId: "OP15-056",
  slug: "would-you-let-me-eat-the-flame-flame-fruit/op15-056",
  name: "Would You Let Me Eat the Flame-Flame Fruit?",
  printings: [
    {
      id: "OP15-056",
      artId: "OP15-056",
      setCode: "OP15",
      collectorNumber: "056",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-056_CoWMe41.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP15",
  cost: 7,
  trigger: "Draw 2 cards.",
  traits: ["Revolutionary Army Dressrosa"],
  effect:
    "[Main] Draw 2 cards. Then, your [Lucy] Leader gains [Double Attack] and +3000 power during this turn.\n(This card deals 2 damage.)",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Lucy",
                },
              ],
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Lucy",
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op15WouldYouLetMeEatTheFlameFlameFruit056I18n,
};
