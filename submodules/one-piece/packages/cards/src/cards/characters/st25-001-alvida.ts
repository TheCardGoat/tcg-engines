import type { CharacterCard } from "@tcg/op-types";
import { st25Alvida001I18n } from "./st25-001-alvida.i18n.ts";
export const st25Alvida001: CharacterCard = {
  id: "ST25-001",
  canonicalId: "ST25-001",
  slug: "alvida/st25-001",
  name: "Alvida",
  printings: [
    {
      id: "ST25-001",
      artId: "ST25-001",
      setCode: "ST25",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST25-001.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST25",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Cross Guild"],
  attribute: "strike",
  effect:
    "If you have 2 or more Characters with a base cost of 5 or more, this Character gains +1 cost. [On Play] If your Leader is [Buggy], draw 3 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Buggy",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
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
          },
        ],
      },
    ],
  },
  i18n: st25Alvida001I18n,
};
