import type { CharacterCard } from "@tcg/op-types";
import { op06Ryuma036I18n } from "./036-ryuma.i18n.ts";

export const op06Ryuma036: CharacterCard = {
  id: "OP06-036",
  canonicalId: "OP06-036",
  slug: "ryuma/op06-036",
  name: "Ryuma",
  printings: [
    {
      id: "OP06-036",
      artId: "OP06-036",
      setCode: "OP06",
      collectorNumber: "036",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  power: 6000,
  traits: ["Land of Wano Thriller Bark Pirates"],
  attribute: "slash",
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
  i18n: op06Ryuma036I18n,
};
