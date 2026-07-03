import type { EventCard } from "@tcg/op-types";
import { op07BlazeSlice116I18n } from "./116-blaze-slice.i18n.ts";

export const op07BlazeSlice116: EventCard = {
  id: "OP07-116",
  canonicalId: "OP07-116",
  slug: "blaze-slice",
  name: "Blaze Slice",
  printings: [
    {
      id: "OP07-116",
      artId: "OP07-116",
      setCode: "OP07",
      collectorNumber: "116",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-116.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP07",
  cost: 1,
  traits: ["Land of Wano The Akazaya Nine"],
  effect:
    "[Main] / [Counter] Up to 1 of your Leader or Character cards gains +1000 power during this turn. Then, if your opponent has 2 or less Life cards, rest up to 1 of your opponent's Characters with a cost of 4 or less. [Trigger] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            duration: "thisTurn",
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
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07BlazeSlice116I18n,
};
