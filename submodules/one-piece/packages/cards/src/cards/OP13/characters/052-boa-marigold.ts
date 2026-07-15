import type { CharacterCard } from "@tcg/op-types";
import { op13BoaMarigold052I18n } from "./052-boa-marigold.i18n.ts";

export const op13BoaMarigold052: CharacterCard = {
  id: "OP13-052",
  canonicalId: "OP13-052",
  slug: "boa-marigold/op13-052",
  name: "Boa Marigold",
  printings: [
    {
      id: "OP13-052",
      artId: "OP13-052",
      setCode: "OP13",
      collectorNumber: "052",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-052_dEx8k6x.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 4000,
  counter: 1000,
  traits: ["Kuja Pirates"],
  attribute: "slash",
  effect:
    "[Blocker]\n[On Play] If your Leader is [Boa Hancock], play up to 1 [Boa Hancock] with a cost of 6 or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Boa Hancock",
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
                filter: "name",
                value: "Boa Hancock",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op13BoaMarigold052I18n,
};
