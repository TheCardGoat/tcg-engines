import type { CharacterCard } from "@tcg/op-types";
import { prb02LimejuicePirateFoil014I18n } from "./014-limejuice-pirate-foil.i18n.ts";

export const prb02LimejuicePirateFoil014: CharacterCard = {
  id: "OP09-014",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB02",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Red-Haired Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-014_r1_hX8Bgxy.jpg",
      imageId: "OP09-014",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-014_p2.jpg",
      imageId: "OP09-014_p2",
    },
  ],
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
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02LimejuicePirateFoil014I18n,
};
