import type { CharacterCard } from "@tcg/op-types";
import { op06Hatchan031I18n } from "./031-hatchan.i18n.ts";

export const op06Hatchan031: CharacterCard = {
  id: "OP06-031",
  canonicalId: "OP06-031",
  slug: "hatchan/op06-031",
  name: "Hatchan",
  printings: [
    {
      id: "OP06-031",
      artId: "OP06-031",
      setCode: "OP06",
      collectorNumber: "031",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-031.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    "Play up to 1 [Fish-Man] or [Merfolk] type Character card with a cost of 3 or less from your hand.",
  traits: ["Fish-Man", "Former Arlong Pirates"],
  attribute: "slash",
  effect:
    "[Trigger] Play up to 1 [Fish-Man] or [Merfolk] type Character card with a cost of 3 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
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
                value: 3,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Fish-Man",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Merfolk",
                    match: "includes",
                  },
                ],
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
  i18n: op06Hatchan031I18n,
};
