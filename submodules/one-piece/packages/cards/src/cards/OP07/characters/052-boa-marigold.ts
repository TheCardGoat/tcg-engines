import type { CharacterCard } from "@tcg/op-types";
import { op07BoaMarigold052I18n } from "./052-boa-marigold.i18n.ts";

export const op07BoaMarigold052: CharacterCard = {
  id: "OP07-052",
  canonicalId: "OP07-052",
  slug: "boa-marigold/op07-052",
  name: "Boa Marigold",
  printings: [
    {
      id: "OP07-052",
      artId: "OP07-052",
      setCode: "OP07",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-052.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Kuja Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If you have 2 or more {Amazon Lily} or {Kuja Pirates} type Characters on your field, place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Amazon Lily",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Kuja Pirates",
                    match: "includes",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op07BoaMarigold052I18n,
};
