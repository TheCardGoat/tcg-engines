import type { CharacterCard } from "@tcg/op-types";
import { pRoronoaZoro056I18n } from "./p-056-roronoa-zoro.i18n.ts";
export const pRoronoaZoro056: CharacterCard = {
  id: "P-056",
  canonicalId: "P-056",
  slug: "roronoa-zoro/p-056",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "P-056",
      artId: "P-056",
      setCode: "P",
      collectorNumber: "056",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-056.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 4,
  traits: ["Straw Hat Crew"],
  power: 6000,
  attribute: "slash",
  effect:
    "[On Play] ➁ (You may rest the specified number of DON!! cards in your cost area.): Return up to 1 Character with a cost of 5 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: pRoronoaZoro056I18n,
};
