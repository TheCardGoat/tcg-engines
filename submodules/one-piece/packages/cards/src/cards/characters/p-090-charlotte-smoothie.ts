import type { CharacterCard } from "@tcg/op-types";
import { pCharlotteSmoothie090I18n } from "./p-090-charlotte-smoothie.i18n.ts";
export const pCharlotteSmoothie090: CharacterCard = {
  id: "P-090",
  canonicalId: "P-090",
  slug: "charlotte-smoothie/p-090",
  name: "Charlotte Smoothie",
  printings: [
    {
      id: "P-090",
      artId: "P-090",
      setCode: "P",
      collectorNumber: "090",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-090.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Opponent's Turn] [On K.O.] DON!! −1: Play up to 1 {Big Mom Pirates} type Character card with a cost equal to or less than the number of DON!! cards on your opponent's field other than [Charlotte Smoothie] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
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
                filter: "excludeName",
                value: "Charlotte Smoothie",
              },
              {
                filter: "dynamicCost",
                comparison: "lte",
                source: "opponentDonCount",
              },
              {
                filter: "trait",
                value: "Big Mom Pirates",
                match: "exact",
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
  i18n: pCharlotteSmoothie090I18n,
};
