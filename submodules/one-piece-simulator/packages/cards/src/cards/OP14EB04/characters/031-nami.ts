import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Nami031I18n } from "./031-nami.i18n.ts";

export const op14eb04Nami031: CharacterCard = {
  id: "OP14-031",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 4,
  power: 2000,
  traits: ["FILM Straw Hat Crew"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-031_p1_S44j4Cc.jpg",
      imageId: "OP14-031_p1",
    },
  ],
  effect:
    "[Blocker]\n[On Play] Rest up to 2 of your opponent's Characters with a cost of 8 or less. Then, set up to 5 of your DON!! cards as active at the end of this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 5,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Nami031I18n,
};
