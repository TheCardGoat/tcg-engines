import type { CharacterCard } from "@tcg/op-types";
import { st29Usopp002I18n } from "./st29-002-usopp.i18n.ts";
export const st29Usopp002: CharacterCard = {
  id: "ST29-002",
  canonicalId: "ST29-002",
  slug: "usopp/st29-002",
  name: "Usopp",
  printings: [
    {
      id: "ST29-002",
      artId: "ST29-002",
      setCode: "ST29",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-002.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Egghead", "Straw Hat Crew"],
  attribute: "ranged",
  effect:
    "[On Play]/[When Attacking] Rest up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.",
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "opponentLifeCount",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "whenAttacking",
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "opponentLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st29Usopp002I18n,
};
