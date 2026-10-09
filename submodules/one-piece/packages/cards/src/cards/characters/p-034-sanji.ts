import type { CharacterCard } from "@tcg/op-types";
import { pSanji034I18n } from "./p-034-sanji.i18n.ts";
export const pSanji034: CharacterCard = {
  id: "P-034",
  canonicalId: "P-034",
  slug: "sanji/p-034",
  name: "Sanji",
  printings: [
    {
      id: "P-034",
      artId: "P-034",
      setCode: "P",
      collectorNumber: "034",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-034.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["The Vinsmoke Family"],
  attribute: "strike",
  effect:
    "[DON!! x1] [Your Turn] If you have 2 or less Life cards, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pSanji034I18n,
};
