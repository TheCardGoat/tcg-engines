import type { EventCard } from "@tcg/op-types";
import { op15ItSAnOrderDoNotDefyMe038I18n } from "./op15-038-it-s-an-order-do-not-defy-me.i18n.ts";

export const op15ItSAnOrderDoNotDefyMe038: EventCard = {
  id: "OP15-038",
  canonicalId: "OP15-038",
  slug: "it-s-an-order-do-not-defy-me/op15-038",
  name: "It's an Order! Do Not Defy Me!!!",
  printings: [
    {
      id: "OP15-038",
      artId: "OP15-038",
      setCode: "OP15",
      collectorNumber: "038",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-038_6VB9RC9.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP15",
  cost: 1,
  traits: ["Krieg Pirates East Blue"],
  effect:
    "[Main] Up to 1 of your opponent's rested Characters with a cost of 8 or less that has 2 or more DON!! cards given will not become active in your opponent's next Refresh Phase.[Counter] Up to 1 of your [Krieg] cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "freeze",
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
                  value: 8,
                },
              ],
            },
          },
        ],
      },
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
              filters: [
                {
                  filter: "name",
                  value: "Krieg",
                },
              ],
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op15ItSAnOrderDoNotDefyMe038I18n,
};
