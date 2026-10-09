import type { CharacterCard } from "@tcg/op-types";
import { st06Smoker004I18n } from "./st06-004-smoker.i18n.ts";
export const st06Smoker004: CharacterCard = {
  id: "ST06-004",
  canonicalId: "ST06-004",
  slug: "smoker/st06-004",
  name: "Smoker",
  printings: [
    {
      id: "ST06-004",
      artId: "ST06-004",
      setCode: "ST06",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-004.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST06",
  cost: 5,
  power: 7000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "This Character cannot be K.O.'d by effects. [DON!! x1] If there is a Character with a cost of 0, this Character gains [Double Attack]. (This card deals 2 damage.)",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "byEffect",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                value: 0,
                comparison: "eq",
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "doubleAttack",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st06Smoker004I18n,
};
