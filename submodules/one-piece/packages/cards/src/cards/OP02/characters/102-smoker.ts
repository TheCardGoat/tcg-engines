import type { CharacterCard } from "@tcg/op-types";
import { op02Smoker102I18n } from "./102-smoker.i18n.ts";

export const op02Smoker102: CharacterCard = {
  id: "OP02-102",
  canonicalId: "OP02-102",
  slug: "smoker/op02-102",
  name: "Smoker",
  printings: [
    {
      id: "OP02-102",
      artId: "OP02-102",
      setCode: "OP02",
      collectorNumber: "102",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-102.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "This Character cannot be K.O.'d by effects. [When Attacking] If there is a Character with a cost of 0, this Character gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 0,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op02Smoker102I18n,
};
