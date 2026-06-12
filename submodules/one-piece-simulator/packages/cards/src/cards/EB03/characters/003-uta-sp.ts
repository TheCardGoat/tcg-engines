import type { CharacterCard } from "@tcg/op-types";
import { eb03UtaSp003I18n } from "./003-uta-sp.i18n.ts";

export const eb03UtaSp003: CharacterCard = {
  id: "EB03-003",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "EB03",
  cost: 5,
  power: 7000,
  traits: ["FILM"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-003_a1HWpXc.jpg",
      imageId: "EB03-003",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-003_p1_viX3Rl8.jpg",
      imageId: "EB03-003_p1",
    },
  ],
  effect:
    "[On Play] If your Leader is [Uta], draw 2 cards. Then, play up to 1 Character card with 6000 power or less and no base effect from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Uta",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
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
  i18n: eb03UtaSp003I18n,
};
