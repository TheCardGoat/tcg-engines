import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy135I18n } from "./p-135-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy135: CharacterCard = {
  id: "P-135",
  canonicalId: "P-135",
  slug: "monkey-d-luffy/p-135",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-135",
      artId: "P-135",
      setCode: "P",
      collectorNumber: "135",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-135.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy135I18n,
};
