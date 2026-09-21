import type { EventCard } from "@tcg/op-types";
import { op02IceAge117I18n } from "./op02-117-ice-age.i18n.ts";

export const op02IceAge117: EventCard = {
  id: "OP02-117",
  canonicalId: "OP02-117",
  slug: "ice-age",
  name: "Ice Age",
  printings: [
    {
      id: "OP02-117",
      artId: "OP02-117",
      setCode: "OP02",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117.jpg",
    },
    {
      id: "OP02-117_p5",
      artId: "OP02-117_p5",
      setCode: "OP02",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_p5.jpg",
      label: "Ice Age (Jolly Roger Foil)",
    },
    {
      id: "OP02-117_p6",
      artId: "OP02-117_p6",
      setCode: "OP02",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_p6.jpg",
    },
    {
      id: "OP02-117_r2",
      artId: "OP02-117_r2",
      setCode: "OP02",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_r2.jpg",
      label: "Ice Age",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  traits: ["Navy"],
  effect:
    "[Main] Give up to 1 of your opponent's Characters -5 cost during this turn. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            value: -5,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
        ],
      },
    ],
  },
  i18n: op02IceAge117I18n,
};
