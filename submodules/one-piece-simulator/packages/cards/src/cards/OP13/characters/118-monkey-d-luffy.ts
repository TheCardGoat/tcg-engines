import type { CharacterCard } from "@tcg/op-types";
import { op13MonkeyDLuffy118I18n } from "./118-monkey-d-luffy.i18n.ts";

export const op13MonkeyDLuffy118: CharacterCard = {
  id: "OP13-118",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew Supernovas Fish-Man Island"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_p4_QcLxwMi.png",
      imageId: "OP13-118_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_p2_t8HeAN4.png",
      imageId: "OP13-118_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_p3_asWvw9M.png",
      imageId: "OP13-118_p3",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_p1_Ly1IuQY.jpg",
      imageId: "OP13-118_p1",
    },
  ],
  effect:
    "[Double Attack]\n[On Play] If your Leader is multicolored, set up to 4 of your DON!! cards as active. Then, you cannot play Character cards with a base cost of 5 or more during this turn.",
  effects: {
    keywords: ["doubleAttack"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 4,
                upTo: true,
              },
            },
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "baseCost",
                comparison: "gte",
                value: 5,
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13MonkeyDLuffy118I18n,
};
