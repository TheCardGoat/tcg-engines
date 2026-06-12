import type { CharacterCard } from "@tcg/op-types";
import { prb02UsoHachiReprint001I18n } from "./001-uso-hachi-reprint.i18n.ts";

export const prb02UsoHachiReprint001: CharacterCard = {
  id: "ST18-001",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "PRB02",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-001_p2.jpg",
      imageId: "ST18-001_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-001_p3.jpg",
      imageId: "ST18-001_p3",
    },
  ],
  effect:
    '[On Play] If you have 8 or more DON!! cards on your field, rest up to 1 of your opponent\'s Characters with a cost of 5 or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
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
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02UsoHachiReprint001I18n,
};
