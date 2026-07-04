import type { CharacterCard } from "@tcg/op-types";
import { op03Adio002I18n } from "./002-adio.i18n.ts";

export const op03Adio002: CharacterCard = {
  id: "OP03-002",
  canonicalId: "OP03-002",
  slug: "adio/op03-002",
  name: "Adio",
  printings: [
    {
      id: "OP03-002",
      artId: "OP03-002",
      setCode: "OP03",
      collectorNumber: "002",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-002.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["ODYSSEY"],
  attribute: "ranged",
  effect:
    "[DON!! x1] [When Attacking] Your opponent cannot activate a [Blocker] Character that has 2000 or less power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op03Adio002I18n,
};
