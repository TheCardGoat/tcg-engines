import type { CharacterCard } from "@tcg/op-types";
import { pArlong048I18n } from "./p-048-arlong.i18n.ts";
export const pArlong048: CharacterCard = {
  id: "P-048",
  canonicalId: "P-048",
  slug: "arlong/p-048",
  name: "Arlong",
  printings: [
    {
      id: "P-048",
      artId: "P-048",
      setCode: "P",
      collectorNumber: "048",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-048.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 3,
  traits: ["Fish-Man", "Arlong Pirates"],
  power: 4000,
  counter: 1000,
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] If you have 4 or more Life cards, your opponent places 1 card from their hand at the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "gte",
            value: 4,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              chosenBy: "opponent",
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: pArlong048I18n,
};
