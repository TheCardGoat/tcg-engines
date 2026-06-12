import type { CharacterCard } from "@tcg/op-types";
import { eb02Usopp022I18n } from "./022-usopp.i18n.ts";

export const eb02Usopp022: CharacterCard = {
  id: "EB02-022",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew East Blue"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-022_p1.png",
      imageId: "EB02-022_p1",
    },
  ],
  effect:
    "[On Play] If you have 2 or less Characters with 5000 power or more, play up to 1 Character card with 6000 power or less and no base effect from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "lte",
            value: 2,
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 5000,
              },
            ],
          },
        ],
        actions: [
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
                filter: "hasEffectType",
                value: "onPlay",
                negate: true,
              },
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
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
  i18n: eb02Usopp022I18n,
};
