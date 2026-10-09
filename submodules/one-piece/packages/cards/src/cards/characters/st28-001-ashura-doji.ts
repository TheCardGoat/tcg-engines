import type { CharacterCard } from "@tcg/op-types";
import { st28AshuraDoji001I18n } from "./st28-001-ashura-doji.i18n.ts";
export const st28AshuraDoji001: CharacterCard = {
  id: "ST28-001",
  canonicalId: "ST28-001",
  slug: "ashura-doji/st28-001",
  name: "Ashura Doji",
  printings: [
    {
      id: "ST28-001",
      artId: "ST28-001",
      setCode: "ST28",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST28-001.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST28",
  cost: 3,
  traits: ["Land of Wano", "The Akazaya Nine"],
  power: 3000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[On Play] If your Leader has the {Land of Wano} type and your opponent has 3 or more Life cards, K.O. up to 1 of your opponent's Characters with a base cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Land of Wano",
                match: "exact",
              },
              {
                condition: "lifeCount",
                player: "opponent",
                comparison: "gte",
                value: 3,
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
                  filter: "baseCost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st28AshuraDoji001I18n,
};
