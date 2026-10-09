import type { CharacterCard } from "@tcg/op-types";
import { pRoronoaZoro094I18n } from "./p-094-roronoa-zoro.i18n.ts";
export const pRoronoaZoro094: CharacterCard = {
  id: "P-094",
  canonicalId: "P-094",
  slug: "roronoa-zoro/p-094",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "P-094",
      artId: "P-094",
      setCode: "P",
      collectorNumber: "094",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-094.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  power: 4000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  cost: 4,
  counter: 2000,
  effect: "[On Play] K.O. up to 1 of your opponent's rested Characters with a cost of 2 or less.",
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
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pRoronoaZoro094I18n,
};
