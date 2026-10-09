import type { CharacterCard } from "@tcg/op-types";
import { st31Sanji001I18n } from "./st31-001-sanji.i18n.ts";
export const st31Sanji001: CharacterCard = {
  id: "ST31-001",
  canonicalId: "ST31-001",
  slug: "sanji/st31-001",
  name: "Sanji",
  printings: [
    {
      id: "ST31-001",
      artId: "ST31-001",
      setCode: "ST31",
      collectorNumber: "001",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST31-001.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST31",
  cost: 5,
  traits: ["Straw Hat Crew"],
  power: 3000,
  counter: 1000,
  attribute: "strike",
  effect:
    "[DON!! x2] This Character gains [Rush]. (This card can attack on the turn in which it is played.) [On Play] Draw 1 card and play up to 1 {Straw Hat Crew} type Character card with a cost of 5 or less other than [Sanji] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
                filter: "excludeName",
                value: "Sanji",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
                match: "exact",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
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
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st31Sanji001I18n,
};
