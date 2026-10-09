import type { CharacterCard } from "@tcg/op-types";
import { pTrafalgarLaw009I18n } from "./p-009-trafalgar-law.i18n.ts";
export const pTrafalgarLaw009: CharacterCard = {
  id: "P-009",
  canonicalId: "P-009",
  slug: "trafalgar-law/p-009",
  name: "Trafalgar Law",
  printings: [
    {
      id: "P-009",
      artId: "P-009",
      setCode: "P",
      collectorNumber: "009",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-009.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 7000,
  traits: ["Supernovas", "Heart Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your opponent has 6 or more cards in their hand, your opponent adds 1 card from their Life area to their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: pTrafalgarLaw009I18n,
};
