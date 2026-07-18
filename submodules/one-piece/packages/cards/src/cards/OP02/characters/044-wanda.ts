import type { CharacterCard } from "@tcg/op-types";
import { op02Wanda044I18n } from "./044-wanda.i18n.ts";

export const op02Wanda044: CharacterCard = {
  id: "OP02-044",
  canonicalId: "OP02-044",
  slug: "wanda/op02-044",
  name: "Wanda",
  printings: [
    {
      id: "OP02-044",
      artId: "OP02-044",
      setCode: "OP02",
      collectorNumber: "044",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-044.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "[On Play] Play up to 1 [Minks] type Character card other than [Wanda] with a cost of 3 or less from your hand.",
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
                filter: "excludeName",
                value: "Wanda",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Minks",
                match: "includes",
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
  },
  i18n: op02Wanda044I18n,
};
