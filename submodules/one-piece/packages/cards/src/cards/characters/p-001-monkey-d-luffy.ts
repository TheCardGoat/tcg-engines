import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy001I18n } from "./p-001-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy001: CharacterCard = {
  id: "P-001",
  canonicalId: "P-001",
  slug: "monkey-d-luffy/p-001",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-001",
      artId: "P-001",
      setCode: "P",
      collectorNumber: "001",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-001.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 7000,
  traits: ["Supernovas", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x2] This Character gains [Rush]. (This card can attack on the turn in which it is played.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
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
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy001I18n,
};
