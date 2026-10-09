import type { CharacterCard } from "@tcg/op-types";
import { pRyuma072I18n } from "./p-072-ryuma.i18n.ts";
export const pRyuma072: CharacterCard = {
  id: "P-072",
  canonicalId: "P-072",
  slug: "ryuma/p-072",
  name: "Ryuma",
  printings: [
    {
      id: "P-072",
      artId: "P-072",
      setCode: "P",
      collectorNumber: "072",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-072.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 4,
  traits: ["MONSTERS"],
  power: 6000,
  attribute: "slash",
  effect:
    "[On Play]/[On K.O.] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
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
                amount: 1,
                upTo: true,
              },
              filters: [
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pRyuma072I18n,
};
