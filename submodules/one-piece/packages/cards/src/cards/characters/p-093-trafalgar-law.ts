import type { CharacterCard } from "@tcg/op-types";
import { pTrafalgarLaw093I18n } from "./p-093-trafalgar-law.i18n.ts";
export const pTrafalgarLaw093: CharacterCard = {
  id: "P-093",
  canonicalId: "P-093",
  slug: "trafalgar-law/p-093",
  name: "Trafalgar Law",
  printings: [
    {
      id: "P-093",
      artId: "P-093",
      setCode: "P",
      collectorNumber: "093",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-093.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 6000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  effect:
    "[Blocker] [On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: pTrafalgarLaw093I18n,
};
