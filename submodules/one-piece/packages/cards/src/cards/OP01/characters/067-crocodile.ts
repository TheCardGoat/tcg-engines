import type { CharacterCard } from "@tcg/op-types";
import { op01Crocodile067I18n } from "./067-crocodile.i18n.ts";

export const op01Crocodile067: CharacterCard = {
  id: "OP01-067",
  canonicalId: "OP01-067",
  slug: "crocodile/op01-067",
  name: "Crocodile",
  printings: [
    {
      id: "OP01-067",
      artId: "OP01-067",
      setCode: "OP01",
      collectorNumber: "067",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-067.jpg",
    },
    {
      id: "OP01-067_p1",
      artId: "OP01-067_p1",
      setCode: "OP01",
      collectorNumber: "067",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-067_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP01",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-067_p1.jpg",
      imageId: "OP01-067_p1",
    },
  ],
  effect:
    "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.) [DON!! x1] Give blue Events in your hand -1 cost.",
  effects: {
    keywords: ["banish"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "color",
                  value: "blue",
                },
                {
                  filter: "cardCategory",
                  value: "event",
                },
              ],
            },
            value: -1,
          },
        ],
      },
    ],
  },
  i18n: op01Crocodile067I18n,
};
