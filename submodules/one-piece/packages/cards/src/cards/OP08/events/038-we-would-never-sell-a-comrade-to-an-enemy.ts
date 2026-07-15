import type { EventCard } from "@tcg/op-types";
import { op08WeWouldNeverSellAComradeToAnEnemy038I18n } from "./038-we-would-never-sell-a-comrade-to-an-enemy.i18n.ts";

export const op08WeWouldNeverSellAComradeToAnEnemy038: EventCard = {
  id: "OP08-038",
  canonicalId: "OP08-038",
  slug: "we-would-never-sell-a-comrade-to-an-enemy",
  name: "We Would Never Sell a Comrade to an Enemy!!!",
  printings: [
    {
      id: "OP08-038",
      artId: "OP08-038",
      setCode: "OP08",
      collectorNumber: "038",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-038.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  traits: ["Minks The Akazaya Nine"],
  effect:
    "[Main] You may rest 2 of your Characters: None of your Characters can be K.O.'d by your opponent's effects until the end of your opponent's next turn. [Trigger] Rest up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 2,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            duration: "untilEndOfOpponentNextTurn",
            restriction: "byEffect",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
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
        ],
      },
    ],
  },
  i18n: op08WeWouldNeverSellAComradeToAnEnemy038I18n,
};
