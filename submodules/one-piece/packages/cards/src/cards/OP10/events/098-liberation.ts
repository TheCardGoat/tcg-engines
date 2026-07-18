import type { EventCard } from "@tcg/op-types";
import { op10Liberation098I18n } from "./098-liberation.i18n.ts";

export const op10Liberation098: EventCard = {
  id: "OP10-098",
  canonicalId: "OP10-098",
  slug: "liberation",
  name: "Liberation",
  printings: [
    {
      id: "OP10-098",
      artId: "OP10-098",
      setCode: "OP10",
      collectorNumber: "098",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-098.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP10",
  cost: 6,
  trigger:
    "Negate the effect of up to 1 of each of your opponent's Leader and Character cards during this turn.",
  traits: ["Blackbeard Pirates"],
  effect:
    "[Main] If the number of your Characters is at least 2 less than the number of your opponent's Characters, K.O. up to 1 of your opponent's Characters with a base cost of 6 or less and up to 1 of your opponent's Characters with a base cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "zoneCountComparison",
            zone: "character",
            selfComparison: "lt",
            difference: 2,
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
                  filter: "baseCost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "baseCost", comparison: "lte", value: 4 }],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["leader"],
              count: { amount: 1, upTo: true },
            },
            duration: "thisTurn",
          },
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op10Liberation098I18n,
};
