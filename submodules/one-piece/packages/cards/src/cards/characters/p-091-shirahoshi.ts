import type { CharacterCard } from "@tcg/op-types";
import { pShirahoshi091I18n } from "./p-091-shirahoshi.i18n.ts";
export const pShirahoshi091: CharacterCard = {
  id: "P-091",
  canonicalId: "P-091",
  slug: "shirahoshi/p-091",
  name: "Shirahoshi",
  printings: [
    {
      id: "P-091",
      artId: "P-091",
      setCode: "P",
      collectorNumber: "091",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-091.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 0,
  counter: 1000,
  traits: ["Merfolk", "Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[On Play] Play up to 1 {Neptunian} or {Fish-Man Island} type Character card with a cost of 5 or less from your hand. [Activate: Main] You may rest this Character: Up to 1 of your {Neptunian} type Characters can attack Characters on the turn in which it is played.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                value: 5,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Neptunian",
                    match: "exact",
                  },
                  {
                    filter: "trait",
                    value: "Fish-Man Island",
                    match: "exact",
                  },
                ],
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
      {
        trigger: "activateMain",
        optional: true,
        costs: [
          {
            cost: "restThisCard",
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
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Neptunian",
                  match: "exact",
                },
              ],
            },
            keyword: "rushCharacter",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: pShirahoshi091I18n,
};
