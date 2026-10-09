import type { CharacterCard } from "@tcg/op-types";
import { pMissValentineMikita147I18n } from "./p-147-miss-valentine-mikita.i18n.ts";
export const pMissValentineMikita147: CharacterCard = {
  id: "P-147",
  canonicalId: "P-147",
  slug: "miss-valentine-mikita/p-147",
  name: "Miss.Valentine(Mikita)",
  printings: [
    {
      id: "P-147",
      artId: "P-147",
      setCode: "P",
      collectorNumber: "147",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-147.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 3,
  traits: ["Baroque Works"],
  power: 3000,
  attribute: "strike",
  counter: 1000,
  effect:
    'If there is a Character with a cost of 0 or with a cost of 8 or more, this Character gains +2000 power. [On K.O.] Add up to 1 Character card with a type including "Baroque Works" from your trash to your hand.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            comparison: "gte",
            value: 1,
            player: "any",
            zone: "character",
            filters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "cost",
                    value: 0,
                    comparison: "eq",
                  },
                  {
                    filter: "cost",
                    value: 8,
                    comparison: "gte",
                  },
                ],
              },
            ],
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "trait",
                  value: "Baroque Works",
                  match: "includes",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pMissValentineMikita147I18n,
};
