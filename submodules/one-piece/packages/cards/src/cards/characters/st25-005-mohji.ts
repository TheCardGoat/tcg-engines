import type { CharacterCard } from "@tcg/op-types";
import { st25Mohji005I18n } from "./st25-005-mohji.i18n.ts";
export const st25Mohji005: CharacterCard = {
  id: "ST25-005",
  canonicalId: "ST25-005",
  slug: "mohji/st25-005",
  name: "Mohji",
  printings: [
    {
      id: "ST25-005",
      artId: "ST25-005",
      setCode: "ST25",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST25-005.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST25",
  cost: 4,
  power: 1000,
  counter: 2000,
  traits: ["Cross Guild"],
  attribute: "wisdom",
  effect:
    "If you have 2 or more Characters with a base cost of 5 or more, this Character gains [Blocker] and +1 cost. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] If your Leader is [Buggy] and you have 3 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderName",
                name: "Buggy",
              },
              {
                condition: "handCount",
                player: "self",
                comparison: "lte",
                value: 3,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "baseCost",
                comparison: "gte",
                value: 5,
              },
            ],
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
            keyword: "blocker",
            duration: "permanent",
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st25Mohji005I18n,
};
