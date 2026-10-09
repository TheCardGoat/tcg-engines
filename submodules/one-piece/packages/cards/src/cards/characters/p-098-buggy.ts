import type { CharacterCard } from "@tcg/op-types";
import { pBuggy098I18n } from "./p-098-buggy.i18n.ts";
export const pBuggy098: CharacterCard = {
  id: "P-098",
  canonicalId: "P-098",
  slug: "buggy/p-098",
  name: "Buggy",
  printings: [
    {
      id: "P-098",
      artId: "P-098",
      setCode: "P",
      collectorNumber: "098",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-098.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors", "Cross Guild"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] If you do not have 5 Characters with a cost of 5 or more, place this Character at the bottom of the owner's deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "lt",
            value: 5,
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: pBuggy098I18n,
};
