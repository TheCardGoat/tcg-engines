import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Humandrill032I18n } from "./032-humandrill.i18n.ts";

export const op14eb04Humandrill032: CharacterCard = {
  id: "OP14-032",
  canonicalId: "OP14-032",
  slug: "humandrill",
  name: "Humandrill",
  printings: [
    {
      id: "OP14-032",
      artId: "OP14-032",
      setCode: "OP14EB04",
      collectorNumber: "032",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-032_SZprAvX.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Animal Muggy Kingdom"],
  attribute: "slash",
  effect:
    "[Your Turn] When this Character becomes rested, rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "whenBecomesRested",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Humandrill032I18n,
};
