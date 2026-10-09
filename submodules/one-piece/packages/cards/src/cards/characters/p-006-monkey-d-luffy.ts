import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy006I18n } from "./p-006-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy006: CharacterCard = {
  id: "P-006",
  canonicalId: "P-006",
  slug: "monkey-d-luffy/p-006",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-006",
      artId: "P-006",
      setCode: "P",
      collectorNumber: "006",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-006.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Supernovas", "Straw Hat Crew"],
  attribute: "strike",
  effect: "[DON!! x2] [Your Turn] This Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "turn",
            value: "your",
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
  i18n: pMonkeyDLuffy006I18n,
};
