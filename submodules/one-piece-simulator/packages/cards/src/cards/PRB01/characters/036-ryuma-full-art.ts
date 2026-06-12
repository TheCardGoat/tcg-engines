import type { CharacterCard } from "@tcg/op-types";
import { prb01RyumaFullArt036I18n } from "./036-ryuma-full-art.i18n.ts";

export const prb01RyumaFullArt036: CharacterCard = {
  id: "OP06-036",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB01",
  cost: 4,
  power: 6000,
  traits: ["Land of Wano Thriller Bark Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_p2.jpg",
      imageId: "OP06-036_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_r1.png",
      imageId: "OP06-036_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_p4.jpg",
      imageId: "OP06-036_p4",
    },
  ],
  effect:
    "[On Play] / [On K.O.] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb01RyumaFullArt036I18n,
};
