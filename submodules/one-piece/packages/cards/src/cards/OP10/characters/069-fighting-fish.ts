import type { CharacterCard } from "@tcg/op-types";
import { op10FightingFish069I18n } from "./069-fighting-fish.i18n.ts";

export const op10FightingFish069: CharacterCard = {
  id: "OP10-069",
  canonicalId: "OP10-069",
  slug: "fighting-fish",
  name: "Fighting Fish",
  printings: [
    {
      id: "OP10-069",
      artId: "OP10-069",
      setCode: "OP10",
      collectorNumber: "069",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-069.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP10",
  cost: 4,
  power: 6000,
  traits: ["Animal Dressrosa"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
  i18n: op10FightingFish069I18n,
};
