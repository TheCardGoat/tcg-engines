import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy035I18n } from "./p-035-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy035: CharacterCard = {
  id: "P-035",
  canonicalId: "P-035",
  slug: "monkey-d-luffy/p-035",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-035",
      artId: "P-035",
      setCode: "P",
      collectorNumber: "035",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-035.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 6000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 0.",
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
            cost: "trashFromHand",
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
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: pMonkeyDLuffy035I18n,
};
