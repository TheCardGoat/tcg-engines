import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDGarp054I18n } from "./p-054-monkey-d-garp.i18n.ts";
export const pMonkeyDGarp054: CharacterCard = {
  id: "P-054",
  canonicalId: "P-054",
  slug: "monkey-d-garp/p-054",
  name: "Monkey.D.Garp",
  printings: [
    {
      id: "P-054",
      artId: "P-054",
      setCode: "P",
      collectorNumber: "054",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-054.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 6,
  traits: ["Navy"],
  power: 7000,
  counter: 1000,
  attribute: "strike",
  effect: "[DON!! x1] This Character cannot be K.O.'d in battle by <Strike> attribute cards.",
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
  i18n: pMonkeyDGarp054I18n,
};
