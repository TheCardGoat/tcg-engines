import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy043I18n } from "./p-043-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy043: CharacterCard = {
  id: "P-043",
  canonicalId: "P-043",
  slug: "monkey-d-luffy/p-043",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-043",
      artId: "P-043",
      setCode: "P",
      collectorNumber: "043",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-043.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect: "[On Play] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy043I18n,
};
