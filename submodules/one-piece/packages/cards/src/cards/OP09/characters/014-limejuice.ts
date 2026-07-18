import type { CharacterCard } from "@tcg/op-types";
import { op09Limejuice014I18n } from "./014-limejuice.i18n.ts";

export const op09Limejuice014: CharacterCard = {
  id: "OP09-014",
  canonicalId: "OP09-014",
  slug: "limejuice",
  name: "Limejuice",
  printings: [
    {
      id: "OP09-014",
      artId: "OP09-014",
      setCode: "OP09",
      collectorNumber: "014",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-014.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Red-Haired Pirates"],
  attribute: "special",
  effect:
    "[On Play] Your opponent cannot activate up to 1 [Blocker] Character that has 4000 power or less during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
            keyword: "blocker",
            requiresKeyword: true,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op09Limejuice014I18n,
};
