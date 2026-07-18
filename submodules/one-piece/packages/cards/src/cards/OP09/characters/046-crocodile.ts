import type { CharacterCard } from "@tcg/op-types";
import { op09Crocodile046I18n } from "./046-crocodile.i18n.ts";

export const op09Crocodile046: CharacterCard = {
  id: "OP09-046",
  canonicalId: "OP09-046",
  slug: "crocodile/op09-046",
  name: "Crocodile",
  printings: [
    {
      id: "OP09-046",
      artId: "OP09-046",
      setCode: "OP09",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-046.jpg",
    },
    {
      id: "OP09-046_p1",
      artId: "OP09-046_p1",
      setCode: "OP09",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-046_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP09",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Former Baroque Works Cross Guild"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-046_p1.jpg",
      imageId: "OP09-046_p1",
    },
  ],
  effect:
    '[On Play] Play up to 1 "Cross Guild" type Character card or Character card with a type including "Baroque Works" with a cost of 5 or less from your hand.',
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
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "allOf",
                    filters: [
                      {
                        filter: "trait",
                        value: "Cross Guild",
                        match: "includes",
                      },
                      {
                        filter: "cardCategory",
                        value: "character",
                      },
                    ],
                  },
                  {
                    filter: "allOf",
                    filters: [
                      {
                        filter: "trait",
                        value: "Baroque Works",
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
        ],
      },
    ],
  },
  i18n: op09Crocodile046I18n,
};
