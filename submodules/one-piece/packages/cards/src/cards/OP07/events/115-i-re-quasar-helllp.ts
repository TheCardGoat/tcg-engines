import type { EventCard } from "@tcg/op-types";
import { op07IReQuasarHelllp115I18n } from "./115-i-re-quasar-helllp.i18n.ts";

export const op07IReQuasarHelllp115: EventCard = {
  id: "OP07-115",
  canonicalId: "OP07-115",
  slug: "i-re-quasar-helllp",
  name: "I Re-Quasar Helllp!!",
  printings: [
    {
      id: "OP07-115",
      artId: "OP07-115",
      setCode: "OP07",
      collectorNumber: "115",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-115.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  traits: ["Scientist Egghead"],
  effect:
    "[Counter] If you have 2 or less Life cards, up to 1 of your Leader or Character cards gains +3000 power during this battle. [Trigger] Play up to 1 of your [Egghead] type Character cards with a cost of 5 or less from your trash.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
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
              {
                filter: "trait",
                value: "Egghead",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op07IReQuasarHelllp115I18n,
};
