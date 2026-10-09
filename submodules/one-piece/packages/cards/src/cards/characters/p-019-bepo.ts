import type { CharacterCard } from "@tcg/op-types";
import { pBepo019I18n } from "./p-019-bepo.i18n.ts";
export const pBepo019: CharacterCard = {
  id: "P-019",
  canonicalId: "P-019",
  slug: "bepo/p-019",
  name: "Bepo",
  printings: [
    {
      id: "P-019",
      artId: "P-019",
      setCode: "P",
      collectorNumber: "019",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-019.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 2000,
  counter: 2000,
  traits: ["FILM", "Minks", "Heart Pirates"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] K.O. up to 1 of your opponent's Characters with 3000 power or less.",
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
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pBepo019I18n,
};
