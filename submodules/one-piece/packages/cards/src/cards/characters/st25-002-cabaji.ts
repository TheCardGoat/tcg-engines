import type { CharacterCard } from "@tcg/op-types";
import { st25Cabaji002I18n } from "./st25-002-cabaji.i18n.ts";
export const st25Cabaji002: CharacterCard = {
  id: "ST25-002",
  canonicalId: "ST25-002",
  slug: "cabaji/st25-002",
  name: "Cabaji",
  printings: [
    {
      id: "ST25-002",
      artId: "ST25-002",
      setCode: "ST25",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST25-002.png",
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
  attribute: "slash",
  effect:
    "If you have 2 or more Characters with a base cost of 5 or more, this Character gains [Blocker] and +1 cost. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Opponent's Turn] This Character gains +5000 power.",
  effects: {
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
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 5000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st25Cabaji002I18n,
};
