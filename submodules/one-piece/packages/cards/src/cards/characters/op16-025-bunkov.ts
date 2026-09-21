import type { CharacterCard } from "@tcg/op-types";
import { op16Bunkov025I18n } from "./op16-025-bunkov.i18n.ts";

export const op16Bunkov025: CharacterCard = {
  id: "OP16-025",
  canonicalId: "OP16-025",
  slug: "bunkov/op16-025",
  name: "Bunkov",
  printings: [
    {
      id: "OP16-025",
      artId: "OP16-025",
      setCode: "OP16",
      collectorNumber: "025",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-025_U0iswOY.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP16",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Impel Down"],
  attribute: "strike",
  effect:
    "[When Attacking] If you have [Antlerkov], play up to 1 Character card with a cost of 2 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Antlerkov",
              },
            ],
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
                value: 2,
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
  i18n: op16Bunkov025I18n,
};
