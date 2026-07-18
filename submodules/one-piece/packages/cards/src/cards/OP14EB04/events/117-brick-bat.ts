import type { EventCard } from "@tcg/op-types";
import { op14eb04BrickBat117I18n } from "./117-brick-bat.i18n.ts";

export const op14eb04BrickBat117: EventCard = {
  id: "OP14-117",
  canonicalId: "OP14-117",
  slug: "brick-bat",
  name: "Brick Bat",
  printings: [
    {
      id: "OP14-117",
      artId: "OP14-117",
      setCode: "OP14EB04",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-117_0DUYuoE.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  effect:
    "[Counter] Up to 1 of your {Thriller Bark Pirates} type Leader or Character cards gains +3000 power during this battle.",
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
              filters: [
                {
                  filter: "trait",
                  value: "Thriller Bark Pirates",
                  match: "includes",
                },
              ],
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
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cardCategory", value: "character" },
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op14eb04BrickBat117I18n,
};
