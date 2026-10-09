import type { CharacterCard } from "@tcg/op-types";
import { st25Buggy004I18n } from "./st25-004-buggy.i18n.ts";
export const st25Buggy004: CharacterCard = {
  id: "ST25-004",
  canonicalId: "ST25-004",
  slug: "buggy/st25-004",
  name: "Buggy",
  printings: [
    {
      id: "ST25-004",
      artId: "ST25-004",
      setCode: "ST25",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST25-004.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "ST25",
  cost: 4,
  power: 1000,
  counter: 1000,
  traits: ["The Four Emperors", "Cross Guild"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may trash 1 card from your hand and trash this Character: If your Leader is [Buggy], play up to 1 {Cross Guild} type Character card with a cost of 6 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 6,
              },
              {
                filter: "trait",
                value: "Cross Guild",
                match: "exact",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            condition: {
              condition: "leaderName",
              name: "Buggy",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st25Buggy004I18n,
};
