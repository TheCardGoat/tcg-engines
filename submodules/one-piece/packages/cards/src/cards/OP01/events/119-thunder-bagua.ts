import type { EventCard } from "@tcg/op-types";
import { op01ThunderBagua119I18n } from "./119-thunder-bagua.i18n.ts";

export const op01ThunderBagua119: EventCard = {
  id: "OP01-119",
  canonicalId: "OP01-119",
  slug: "thunder-bagua",
  name: "Thunder Bagua",
  printings: [
    {
      id: "OP01-119",
      artId: "OP01-119",
      setCode: "OP01",
      collectorNumber: "119",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-119.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP01",
  cost: 2,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if you have 2 or less Life cards, add up to 1 DON!! card from your DON!! deck and rest it. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.  This card has been officially errata'd.",
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
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op01ThunderBagua119I18n,
};
