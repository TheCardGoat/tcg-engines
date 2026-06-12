import type { CharacterCard } from "@tcg/op-types";
import { op09Koala103I18n } from "./103-koala.i18n.ts";

export const op09Koala103: CharacterCard = {
  id: "OP09-103",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP09",
  cost: 6,
  power: 6000,
  traits: ["Revolutionary Army"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-103_p1.jpg",
      imageId: "OP09-103_p1",
    },
  ],
  effect:
    '[Blocker]\n[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Play up to 1 "Revolutionary Army" type Character card with a cost of 4 or less from your hand. If you do, draw 1 card.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Koala103I18n,
};
