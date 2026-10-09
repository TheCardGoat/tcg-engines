import type { CharacterCard } from "@tcg/op-types";
import { st14Usopp002I18n } from "./st14-002-usopp.i18n.ts";
export const st14Usopp002: CharacterCard = {
  id: "ST14-002",
  canonicalId: "ST14-002",
  slug: "usopp/st14-002",
  name: "Usopp",
  printings: [
    {
      id: "ST14-002",
      artId: "ST14-002",
      setCode: "ST14",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-002.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST14",
  cost: 3,
  traits: ["Straw Hat Crew"],
  power: 4000,
  attribute: "ranged",
  counter: 1000,
  effect:
    "[DON!! x1] [When Attacking] If you have a Character with a cost of 8 or more, K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
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
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
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
  i18n: st14Usopp002I18n,
};
