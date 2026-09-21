import type { EventCard } from "@tcg/op-types";
import { op15JustWatchMeAce021I18n } from "./op15-021-just-watch-me-ace.i18n.ts";

export const op15JustWatchMeAce021: EventCard = {
  id: "OP15-021",
  canonicalId: "OP15-021",
  slug: "just-watch-me-ace/op15-021",
  name: "Just Watch Me, Ace!!!",
  printings: [
    {
      id: "OP15-021",
      artId: "OP15-021",
      setCode: "OP15",
      collectorNumber: "021",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-021_leGaEox.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP15",
  cost: 4,
  traits: ["Revolutionary Army Dressrosa"],
  effect:
    "If you have 4 or more Events in your trash, give this card in your hand -3 cost.[Main]/[Counter] Give up to 1 of your opponent's Characters -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
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
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 4,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: -3,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15JustWatchMeAce021I18n,
};
