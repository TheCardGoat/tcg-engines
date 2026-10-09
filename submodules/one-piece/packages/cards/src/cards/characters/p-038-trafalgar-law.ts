import type { CharacterCard } from "@tcg/op-types";
import { pTrafalgarLaw038I18n } from "./p-038-trafalgar-law.i18n.ts";
export const pTrafalgarLaw038: CharacterCard = {
  id: "P-038",
  canonicalId: "P-038",
  slug: "trafalgar-law/p-038",
  name: "Trafalgar Law",
  printings: [
    {
      id: "P-038",
      artId: "P-038",
      setCode: "P",
      collectorNumber: "038",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-038.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  power: 5000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  cost: 4,
  counter: 1000,
  effect:
    "[On Play] You may rest your 1 Leader: K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "leader",
              },
            ],
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
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pTrafalgarLaw038I18n,
};
