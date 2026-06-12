import type { CharacterCard } from "@tcg/op-types";
import { op13Stussy110I18n } from "./110-stussy.i18n.ts";

export const op13Stussy110: CharacterCard = {
  id: "OP13-110",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP13",
  cost: 7,
  power: 7000,
  traits: ["CP0 Egghead"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-110_p1_b3Ihbdz.jpg",
      imageId: "OP13-110_p1",
    },
  ],
  effect:
    '[Blocker]\n[On Play] If your Leader has the "Egghead" type, play up to 1 Character card with a cost of 5 or less and a [Trigger] from your hand.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Egghead",
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
                filter: "hasTrigger",
                value: true,
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
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
  i18n: op13Stussy110I18n,
};
