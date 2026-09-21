import type { CharacterCard } from "@tcg/op-types";
import { op17CharlottePerospero110I18n } from "./op17-110-charlotte-perospero.i18n.ts";

export const op17CharlottePerospero110: CharacterCard = {
  id: "OP17-110",
  canonicalId: "OP17-110",
  slug: "charlotte-perospero/op17-110",
  name: "Charlotte Perospero",
  printings: [
    {
      id: "OP17-110",
      artId: "OP17-110",
      setCode: "OP17",
      collectorNumber: "110",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-110_ZltrBel.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP17",
  cost: 7,
  power: 4000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Your Turn] [On Play] Play up to 1 {Big Mom Pirates} type Character card with a cost of 6 or less from your hand. Then, this Character gains [Rush] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
                value: "Big Mom Pirates",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
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
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op17CharlottePerospero110I18n,
};
