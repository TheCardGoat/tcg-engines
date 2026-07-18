import type { CharacterCard } from "@tcg/op-types";
import { op09BeloBetty112I18n } from "./112-belo-betty.i18n.ts";

export const op09BeloBetty112: CharacterCard = {
  id: "OP09-112",
  canonicalId: "OP09-112",
  slug: "belo-betty/op09-112",
  name: "Belo Betty",
  printings: [
    {
      id: "OP09-112",
      artId: "OP09-112",
      setCode: "OP09",
      collectorNumber: "112",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-112.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger:
    'If your Leader has the "Revolutionary Army" type and you and your opponent have a total of 5 or less Life cards, play this card.',
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect: "[On Play] If you have 2 or less Life cards, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Revolutionary Army",
                match: "includes",
              },
              {
                condition: "totalLifeCount",
                comparison: "lte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op09BeloBetty112I18n,
};
