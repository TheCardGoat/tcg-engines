import type { EventCard } from "@tcg/op-types";
import { op08TheEarthWillNotLose115I18n } from "./115-the-earth-will-not-lose.i18n.ts";

export const op08TheEarthWillNotLose115: EventCard = {
  id: "OP08-115",
  canonicalId: "OP08-115",
  slug: "the-earth-will-not-lose",
  name: "The Earth Will Not Lose!",
  printings: [
    {
      id: "OP08-115",
      artId: "OP08-115",
      setCode: "OP08",
      collectorNumber: "115",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-115.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP08",
  cost: 1,
  traits: ["Sky Island Shandian Warrior"],
  effect:
    "[Counter] If your Leader has the {Shandian Warrior} type, up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, play up to 1 [Upper Yard] from your hand. [Trigger] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Shandian Warrior",
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
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Upper Yard",
              },
            ],
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
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op08TheEarthWillNotLose115I18n,
};
