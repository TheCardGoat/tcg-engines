import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy007I18n } from "./p-007-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy007: CharacterCard = {
  id: "P-007",
  canonicalId: "P-007",
  slug: "monkey-d-luffy/p-007",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-007",
      artId: "P-007",
      setCode: "P",
      collectorNumber: "007",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-007.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Supernovas", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] This Character cannot be K.O.'d in battle by ＜Strike＞ attribute Leaders or Characters.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
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
            restriction: "inBattle",
            byFilter: [
              {
                filter: "attribute",
                value: "strike",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy007I18n,
};
