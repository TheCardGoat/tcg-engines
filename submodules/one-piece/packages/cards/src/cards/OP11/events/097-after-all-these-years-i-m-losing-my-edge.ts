import type { EventCard } from "@tcg/op-types";
import { op11AfterAllTheseYearsIMLosingMyEdge097I18n } from "./097-after-all-these-years-i-m-losing-my-edge.i18n.ts";

export const op11AfterAllTheseYearsIMLosingMyEdge097: EventCard = {
  id: "OP11-097",
  canonicalId: "OP11-097",
  slug: "after-all-these-years-i-m-losing-my-edge",
  name: "After All These Years I'm Losing My Edge!!!",
  printings: [
    {
      id: "OP11-097",
      artId: "OP11-097",
      setCode: "OP11",
      collectorNumber: "097",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-097.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP11",
  cost: 1,
  traits: ["Navy"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +1000 power during this battle. Then, if you have 10 or more cards in your trash, add up to 1 black Character card with a cost of 3 or less from your trash to your hand.",
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
            value: 1000,
            duration: "thisBattle",
          },
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "color",
                  value: "black",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 10,
            },
          },
        ],
      },
    ],
  },
  i18n: op11AfterAllTheseYearsIMLosingMyEdge097I18n,
};
