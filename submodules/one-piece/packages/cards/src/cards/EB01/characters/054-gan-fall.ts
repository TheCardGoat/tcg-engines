import type { CharacterCard } from "@tcg/op-types";
import { eb01GanFall054I18n } from "./054-gan-fall.i18n.ts";

export const eb01GanFall054: CharacterCard = {
  id: "EB01-054",
  canonicalId: "EB01-054",
  slug: "gan-fall",
  name: "Gan.Fall",
  printings: [
    {
      id: "EB01-054",
      artId: "EB01-054",
      setCode: "EB01",
      collectorNumber: "054",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-054.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] If your opponent has 1 or less Life cards, K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 1,
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb01GanFall054I18n,
};
