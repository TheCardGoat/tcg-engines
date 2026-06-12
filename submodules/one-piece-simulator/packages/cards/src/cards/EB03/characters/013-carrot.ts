import type { CharacterCard } from "@tcg/op-types";
import { eb03Carrot013I18n } from "./013-carrot.i18n.ts";

export const eb03Carrot013: CharacterCard = {
  id: "EB03-013",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB03",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-013_p1_RoyqPB5.jpg",
      imageId: "EB03-013_p1",
    },
  ],
  effect:
    "[Activate: Main] [Once Per Turn] If this Character was played on this turn, K.O. up to 1 of your opponent's rested Characters with a cost of 5 or less. Then, play up to 1 [Zou] from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "playedThisTurn",
          },
        ],
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
                  value: 5,
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
                filter: "name",
                value: "Zou",
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb03Carrot013I18n,
};
