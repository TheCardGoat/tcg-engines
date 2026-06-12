import type { CharacterCard } from "@tcg/op-types";
import { op05Rebecca091I18n } from "./091-rebecca.i18n.ts";

export const op05Rebecca091: CharacterCard = {
  id: "OP05-091",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP05",
  cost: 4,
  power: 0,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-091_p1.jpg",
      imageId: "OP05-091_p1",
    },
  ],
  effect:
    "[Blocker] [On Play] Add up to 1 black Character card with a cost of 3 to 7 other than [Rebecca] from your trash to your hand. Then, play up to 1 black Character card with a cost of 3 or less from your hand rested.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "black",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
              ],
            },
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
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "color",
                value: "black",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op05Rebecca091I18n,
};
